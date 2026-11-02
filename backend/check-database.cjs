require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const models = Object.fromEntries(['Usuario','Servico','Pedido','Pagamento','Avaliacao'].map(n=>[n,require('./src/models/'+n)]));
const results=[]; const ids={}; const marker='dbcheck-'+Date.now();
const check=(name,ok,detail='')=>{results.push({name,ok,detail});console.log((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));};
async function api(method,path,body,token){const r=await fetch('http://localhost:3000/api'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json().catch(()=>null)};}
async function expect(name,method,path,body,token,status){const r=await api(method,path,body,token);check(name,r.status===status,'HTTP '+r.status+'; esperado '+status);return r.data;}
async function main(){
 if (process.env.MONGODB_DB_NAME !== 'serv_desenvolvimento' || process.env.NODE_ENV === 'production' || process.env.VERCEL) throw Error('Execute apenas no banco serv_desenvolvimento.');
 await mongoose.connect(process.env.MONGODB_URI,{autoIndex:false,dbName:process.env.MONGODB_DB_NAME});
 check('MongoDB ping',(await mongoose.connection.db.admin().ping()).ok===1);
 for(const [n,m] of Object.entries(models)){const indexes=await m.collection.indexes();check('Leitura e índices: '+n,true,`${await m.countDocuments()} documentos; ${indexes.length} índices`);}
 const pass='Check!'+Date.now(); const tokens={};
 for(const role of ['cliente','freelancer','admin']){
  const email=marker+'-'+role+'@example.invalid';
  if(role==='admin') await expect('Bloquear administrador no registro público','POST','/auth/registro',{nome:marker,email,senha:pass,tipo:'admin'},null,400);
  const u=await expect('Registro '+role,'POST','/auth/registro',{nome:marker+' '+role,email,senha:pass,tipo:role==='admin'?'cliente':role},null,201);
  if(!u?.usuario) throw Error('Registro falhou'); ids[role]=u.usuario._id; tokens[role]=u.token;
  if(role==='admin') await models.Usuario.updateOne({_id:ids[role]},{$set:{tipo:'admin'}});
  check('Senha omitida na resposta '+role,!('senha' in u.usuario));
  const stored=await models.Usuario.findById(ids[role]);check('Senha com hash '+role,stored.senha!==pass&&await stored.compararSenha(pass));
  await expect('Login '+role,'POST','/auth/login',{email,senha:pass},null,200);
  await expect('Perfil autenticado '+role,'GET','/auth/me',null,u.token,200);
 }
 const c=tokens.cliente,f=tokens.freelancer,a=tokens.admin;
 await expect('Email duplicado','POST','/auth/registro',{nome:marker,email:marker+'-cliente@example.invalid',senha:pass},null,409);
 await expect('Senha incorreta','POST','/auth/login',{email:marker+'-cliente@example.invalid',senha:'errada'},null,401);
 await expect('Bloqueio sem token','GET','/pedidos',null,null,401);
 await expect('Bloqueio token inválido','GET','/auth/me',null,'invalid',401);
 await expect('Bloquear objeto NoSQL no login','POST','/auth/login',{email:{$ne:null},senha:{$ne:null}},null,400);
 await expect('Bloquear consulta de perfil alheio','GET','/usuarios/'+ids.freelancer,null,c,403);
 await expect('Cliente não cria serviço','POST','/servicos',{titulo:marker,descricao:'teste',preco:10},c,403);
 let s=await expect('Criar serviço','POST','/servicos',{titulo:marker,descricao:'Teste temporário',preco:125,categoria:'Web'},f,201);ids.servico=s._id;
 await expect('Rejeitar preço negativo','POST','/servicos',{titulo:marker,descricao:'teste',preco:-1},f,400);
 await expect('Consultar serviço','GET','/servicos/'+s._id,null,null,200);
 await expect('Pesquisar serviço','GET','/servicos?busca='+marker,null,null,200);
 await expect('Serviços do freelancer','GET','/servicos/meus',null,f,200);
 await expect('Atualizar serviço','PATCH','/servicos/'+s._id,{preco:150},f,200);
 const p=await expect('Criar pedido','POST','/pedidos',{itens:[{servico:s._id,quantidade:2,preco_unitario:1}]},c,201);ids.pedido=p._id;
 check('Total calculado com preço do banco',p.valor_total===300);
 await expect('Consultar pedido próprio','GET','/pedidos/'+p._id,null,c,200);
 await expect('Bloquear consulta de pedido alheio','GET','/pedidos/'+p._id,null,f,403);
 await expect('Listar pedidos próprios','GET','/pedidos',null,c,200);
 await expect('Listar pedidos administrador','GET','/pedidos/todos',null,a,200);
 await expect('Bloquear avaliação antes de conclusão','POST','/avaliacoes',{pedido_id:p._id,servico_id:s._id,nota:5},c,403);
 const pay=await expect('Registrar pagamento','POST','/pagamentos',{pedido_id:p._id,metodo:'pix'},c,201);ids.pagamento=pay._id;
 check('Pagamento usa valor real',pay.valor===300);
 check('Pedido mudou para em_andamento',(await models.Pedido.findById(p._id)).status==='em_andamento');
 await expect('Consultar pagamento próprio','GET','/pagamentos/pedido/'+p._id,null,c,200);
 await expect('Bloquear consulta de pagamento alheio','GET','/pagamentos/pedido/'+p._id,null,f,403);
 await expect('Atualizar pagamento','PATCH','/pagamentos/'+pay._id+'/status',{status:'concluido'},a,200);
 await expect('Concluir pedido','PATCH','/pedidos/'+p._id+'/status',{status:'concluido'},a,200);
 await expect('Rejeitar nota inválida','POST','/avaliacoes',{pedido_id:p._id,servico_id:s._id,nota:6},c,400);
 const review=await expect('Criar avaliação','POST','/avaliacoes',{pedido_id:p._id,servico_id:s._id,nota:5,comentario:marker},c,201);ids.avaliacao=review._id;
 await expect('Bloquear avaliação duplicada','POST','/avaliacoes',{pedido_id:p._id,servico_id:s._id,nota:4},c,409);
 await expect('Consultar avaliações','GET','/avaliacoes/servico/'+s._id,null,null,200);
 await expect('Atualizar usuário próprio','PATCH','/usuarios/'+ids.cliente,{nome:marker+' atualizado'},c,200);
 await expect('Bloquear alteração de usuário alheio','PATCH','/usuarios/'+ids.freelancer,{nome:marker+' alteração indevida'},c,403);
 await expect('Listar usuários administrador','GET','/usuarios',null,a,200);
 await expect('Bloquear listagem usuários por cliente','GET','/usuarios',null,c,403);
 await expect('Listar freelancers','GET','/usuarios/freelancers',null,null,200);
 await expect('Rejeitar pedido vazio','POST','/pedidos',{itens:[]},c,400);
 await expect('Rejeitar quantidade negativa','POST','/pedidos',{itens:[{servico:s._id,quantidade:-1}]},c,400);
 await expect('Rejeitar ID malformado','GET','/servicos/id-invalido',null,null,400);
 await expect('Limitar paginação','GET','/servicos?limit=1000000',null,null,400);
 await expect('Bloquear operadores na consulta','GET','/servicos?categoria[$ne]=Web',null,null,400);
 await expect('Rejeitar corpo excessivo','POST','/auth/login',{email:'x'.repeat(40000),senha:'invalida'},null,413);
 await expect('Excluir serviço temporário','DELETE','/servicos/'+s._id,null,f,204);
 await expect('Excluir usuário temporário','DELETE','/usuarios/'+ids.freelancer,null,a,204);
}
main().catch(e=>check('Execução completa',false,e.message)).finally(async()=>{
 if(mongoose.connection.readyState===1){
  const users=await models.Usuario.find({email:{$regex:'^'+marker}}).select('_id');const uids=users.map(u=>u._id);
  const services=await models.Servico.find({$or:[{usuario:{$in:uids}},{titulo:marker}]}).select('_id'); const sids=services.map(s=>s._id);if(ids.servico)sids.push(new mongoose.Types.ObjectId(ids.servico));
  const orders=await models.Pedido.find({cliente:{$in:uids}}).select('_id');const pids=orders.map(p=>p._id);
  await models.Avaliacao.deleteMany({$or:[{pedido:{$in:pids}},{avaliador:{$in:uids}}]});
  await models.Pagamento.deleteMany({pedido:{$in:pids}});await models.Pedido.deleteMany({_id:{$in:pids}});await models.Servico.deleteMany({_id:{$in:sids}});await models.Usuario.deleteMany({_id:{$in:uids}});
  check('Limpeza dos dados temporários',await models.Usuario.countDocuments({email:{$regex:'^'+marker}})===0&&await models.Pedido.countDocuments({_id:{$in:pids}})===0);
  await mongoose.disconnect();
 }
 fs.writeFileSync('database-check-results.json',JSON.stringify({date:new Date().toISOString(),marker,results},null,2));
 console.log('RESULTADO: '+results.filter(r=>r.ok).length+'/'+results.length+' verificações aprovadas');
 if (results.some(r=>!r.ok)) process.exitCode = 1;
});
