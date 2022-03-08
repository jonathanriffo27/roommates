const fs = require('fs').promises;
const axios = require('axios');
const uuid = require('uuid');
const {send} = require('./email.js');

async function crear_usuario(){
  	const { data } = await axios.get(`https://randomuser.me/api`)
  	const nombre = `${data.results[0].name.first} ${data.results[0].name.last}`; 
  	const debe = 0;
  	const recibe = 0;
  	const id = uuid.v4();
  	const correo = data.results[0].email
  	let nuevoUsuario = {
  		nombre,
  		id,
  		debe,
  		recibe,
  		correo
  	}
  	let datos = await fs.readFile('db.json', 'utf-8')
  	datos = JSON.parse(datos)
  	datos.roommates.push(nuevoUsuario)
  	await fs.writeFile('db.json', JSON.stringify(datos),'utf-8')
}

function update_debe_recibe(datos){
	let totalGastos = 0;
	for(i=0;i<datos.gastos.length;i++){
		totalGastos+=parseInt(datos.gastos[i].monto)
	}
	const debe = parseInt(totalGastos / datos.roommates.length);
	for(let roommate of datos.roommates){
		roommate.debe = debe
		let ha_pagado = 0;
		const gastos_roomate = datos.gastos.filter(gg => gg.roommates==roommate.nombre)
		for (let gasto of gastos_roomate) {
			ha_pagado+= gasto.monto
		}
		roommate.recibe = Math.max(ha_pagado - debe,0)
		if(roommate.recibe >= 0){
			roommate.debe = Math.max(roommate.debe - ha_pagado,0)
		}
	}
  	return datos
}
async function generarGasto(data){
	try{
		let body = JSON.parse(data)
		let roommates = body.roommates;
		let descripcion = body.descripcion;
		let monto = body.monto;
		let id = uuid.v4();
		let nuevoGasto = {
	  		roommates,
	  		descripcion,
	  		monto,
	  		id
			}
		let datos = await fs.readFile('db.json', 'utf-8')
	  	datos = JSON.parse(datos)
	  	datos.gastos.push(nuevoGasto)
	  	datos = update_debe_recibe(datos);
	  	await fs.writeFile('db.json', JSON.stringify(datos),'utf-8')
  	}
  	catch (e){
        throw e;
    }
}

module.exports = {crear_usuario, update_debe_recibe, generarGasto}