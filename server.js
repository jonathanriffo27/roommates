const express = require('express');
const fs = require('fs').promises;
const axios = require('axios');
const uuid = require('uuid');
const {crear_usuario, update_debe_recibe, generarGasto} = require('./utils.js');
const {send} = require('./email.js');

const app = express()
app.use(express.static('public'))

const correos = ['jonathan.riffo7@gmail.com'];
let texto = "Gastos Roommates<br>";

function enviar(datos){
	for(let roommate of datos.roommates){
		correos.push(roommate.correo)
	}
	texto = "Gastos Roommates<br>";
	for(i=0;i<datos.roommates.length;i++){
		texto+=`${datos.roommates[i].nombre} debe: $${datos.roommates[i].debe} y tiene que recibir: ${datos.roommates[i].recibe}<br>`
	}

	console.log('aqui2')
}
app.post('/roommates', async (req, res) => {
	await crear_usuario()
	console.log(`Estado de solicitud:${res.statusCode}`)
	res.json({todo: 'ok'})
})
app.get('/roommates', async (req, res) => {
	let datos = await fs.readFile('db.json', 'utf-8')
  	datos = JSON.parse(datos)
  	console.log(`Estado de solicitud:${res.statusCode}`)
	res.json({roommates: datos.roommates})
})
app.post('/gastos', (req, res) => {
	let body="";
	req.on('data', function(data){
		body+=data
	})
	req.on('end', async function(data){
		await generarGasto(body)
		// body = JSON.parse(body)
		// let roommates = body.roommates;
		// let descripcion = body.descripcion;
		// let monto = body.monto;
		// let id = uuid.v4();
		// let nuevoGasto = {
	 //  		roommates,
	 //  		descripcion,
	 //  		monto,
	 //  		id
  // 		}
  // 		let datos = await fs.readFile('db.json', 'utf-8')
	 //  	datos = JSON.parse(datos)
	 //  	datos.gastos.push(nuevoGasto)
	 //  	datos = update_debe_recibe(datos);
	 //  	await fs.writeFile('db.json', JSON.stringify(datos),'utf-8')
	 //  	send('jonathan.riffo7@gmail.com', 'Hola', 'Hola')
	  	// enviar(datos)
	  	// prueba('correo')
	  	console.log(`Estado de solicitud:${res.statusCode}`)
		res.json({todo: 'ok'})
	})
})
	  	send('jonathan.riffo7@gmail.com', 'Hola', 'Hola')
app.get('/gastos', async (req, res) => {
	let datos = await fs.readFile('db.json', 'utf-8')
  	datos = JSON.parse(datos)
  	console.log(`Estado de solicitud:${res.statusCode}`)
	res.json({gastos: datos.gastos})
})
app.put('/gastos', (req, res) => {
	let body="";
	req.on('data', function(data){
		body+=data
	})
	req.on('end', async function(data){
		body = JSON.parse(body)
		const roommates = body.roommates
		const descripcion = body.descripcion
		const monto = body.monto
		const id = req.query.id; 
		let datos = await fs.readFile('db.json', 'utf-8')
	  	datos = JSON.parse(datos)
	  	const editarGasto = datos.gastos.find(x => x.id == id);
	  	editarGasto.roommates = roommates
	  	editarGasto.descripcion = descripcion
	  	editarGasto.monto = monto
	  	datos = update_debe_recibe(datos);
  		await fs.writeFile('db.json', JSON.stringify(datos),'utf-8')
  		console.log(`Estado de solicitud:${res.statusCode}`)
		res.json({gastos:[]})
	})
})
app.delete('/gastos', async (req, res) => {
	const id = req.query.id; 
	let datos = await fs.readFile('db.json', 'utf-8')
  	datos = JSON.parse(datos)
  	const gastosActual = datos.gastos.filter(x => x.id !== id);
  	datos.gastos = gastosActual
  	datos = update_debe_recibe(datos);
  	await fs.writeFile('db.json', JSON.stringify(datos),'utf-8')
  	console.log(`Estado de solicitud:${res.statusCode}`)
	res.json({gastos:[]})
})

app.listen(3000, () => console.log('Ejecutando en puerto 3000'));