const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width,canvas.height)

const gravity = 0.7
class Sprite {
	constructor({position, velocity, color ='red', offset}) {
	this.position = position
	this.velocity = velocity
	this.height = 150
	this.width = 50
	this.lastKey
	this.attackBox = {
		position: {
			x: this.position.x,
			y: this.position.y
		},
		offset,
		width:100,
		height:50,
	}
	this.color = color
	this.isAttacking
	this.health = 100
	}

	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x,this.position.y,this.width,this.height)

	//atack box
	if(this.isAttacking){
		c.fillStyle = 'green'
		c.fillRect(
			this.attackBox.position.x,
			this.attackBox.position.y,
			this.attackBox.width,
			this.attackBox.height)
		}		
	}


update(){
	this.draw()
	this.attackBox.position.x = this.position.x + this.attackBox.offset.x
	this.attackBox.position.y = this.position.y
	this.position.x += this.velocity.x
	this.position.y += this.velocity.y

	if(this.position.y + this.height + this.velocity.y >= canvas.height) {
	this.velocity.y = 0	
	} else
	this.velocity.y += gravity
	}

attack(){
	this.isAttacking = true

setTimeout(() => {
	this.isAttacking = false
}, 100)

}
}

const player = new Sprite({
	position: {
	x:100,
	y:202
},
velocity: {
	x:0,
	y:1
},
offset: {
	x :0,
	y :0
},
})


const enemy = new Sprite({
	position: {
	x:800,
	y:200
},
velocity: {
		x:0,
		y:1
	},
	offset: {
	x :-50,
	y :0
},
color:'blue'
})

console.log(player)
const keys = {
	q: {
		pressed: false
	},
	d: {
		pressed: false
	},
	z: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
}


function rectangularCollision({rectangle1, rectangle2}){
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
&& rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
&& rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
&& rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
)
}

let timer = 10
function decreaseTimer() {
	if (timer > 0) {
		setTimeout(decreaseTimer, 1000)
		timer--
		document.querySelector("#timer").innerHTML = timer
	}
	if(timer===0){
	if(player.health===enemy.health){
		document.querySelector('.displayText').innerHTML ='Tie'
		document.querySelector('.displayText').style.display ='flex'
	}else if (player.health > enemy.health){
		document.querySelector('.displayText').innerHTML ='Player 01 wins'
		document.querySelector('.displayText').style.display ='flex'
	}else if (enemy.health > player.health){
		document.querySelector('.displayText').innerHTML ='Player 02 wins'
		document.querySelector('.displayText').style.display ='flex'
	}
}
}
decreaseTimer()

function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0,0,canvas.width,canvas.height)
	player.update()
	enemy.update()

player.velocity.x = 0
enemy.velocity.x = 0

//Player movements
	if (keys.q.pressed && player.lastKey === 'q' && player.position.x >= 0){
		player.velocity.x = -5
	} else if (keys.d.pressed && player.lastKey === 'd' && player.position.x < 974){
		player.velocity.x = 5
	}

//Enemy movements
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= 0){
		enemy.velocity.x = -5
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <974){
		enemy.velocity.x = 5
	}

//detect for collision

if (rectangularCollision({
rectangle1: player,
rectangle2: enemy
	}) && player.isAttacking
	){

player.isAttacking = false
enemy.health -= 5
document.querySelector('.enemyHP').style.width = enemy.health + '%'

enemy.color = 'yellow'
} else enemy.color ='blue'
if (enemy.health <=0 || player.health <=0){
	
}
if (rectangularCollision({
rectangle1: enemy,
rectangle2: player
	}) && enemy.isAttacking
	){

enemy.isAttacking = false
player.health -= 5
document.querySelector('.playerHP').style.width = player.health + '%'
player.color = 'yellow'
} else player.color ='red'

}



animate()

window.addEventListener('keydown',(event) => {

	switch(event.key){
		//Cases for the player 
		case 'd':
		keys.d.pressed = true
		player.lastKey = 'd'
		break
		case 'q':
		keys.q.pressed = true
		player.lastKey = 'q'
		break
		case 'z':
		if (player.velocity.y===0){
		player.velocity.y =-20}
		break
		case 'e':
		player.attack()
		break

		//Cases for the enemy
		case 'ArrowRight':
		keys.ArrowRight.pressed = true
		enemy.lastKey = 'ArrowRight'
		break
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = true
		enemy.lastKey = 'ArrowLeft'
		break
		case 'ArrowUp':
		if (enemy.velocity.y===0){
		enemy.velocity.y =-20}
		break
		case '0':
		enemy.attack()									//need to check that back
		break

	}
})
window.addEventListener('keyup',(event) => {

	switch(event.key){
		case 'd':
		keys.d.pressed = false
		break
		case 'q':
		keys.q.pressed = false
		break
		case 'z':
		keys.z.pressed = false
		break
	}

	switch(event.key){
		case 'ArrowRight':
		keys.ArrowRight.pressed = false
		break
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
		case 'ArrowUp':
		keys.ArrowUp.pressed = false
		break
	}
})

//https://developer.mozilla.org/fr/docs/Games/Techniques/2D_collision_detection