import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';

// BASIC SETUP

// définition de la scene et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1100000);
camera.position.y = 5
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// lumières
scene.add(new THREE.AmbientLight(0xd2b48c, 5))
    // définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)







// ACTUAL CODE
// ----------------------------------------------------------------


const initialization = (grid) => {
    let possibilities = [];
    for (let i = 0; i < 9; i++) {
        possibilities[i] = []
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] == 0) {
                possibilities[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            } else {
                possibilities[i][j] = [grid[i][j]]
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; i < 9; i++) {
            console.log(possibilities)
            // Mettez à jour les possibilités dans la même ligne
            for (let k = 0; k < 9; k++) {
                if (k !== j && Array.isArray(possibilities[i][k])) {
                    possibilities[i][k] = possibilities[i][k].filter(num => num !== grid[i][j]);
                }
            }
            // Mettez à jour les possibilités dans la même colonne
            for (let k = 0; k < 9; k++) {
                if (k !== i && Array.isArray(possibilities[k][j])) {
                    possibilities[k][j] = possibilities[k][j].filter(num => num !== grid[i][j]);
                }
            }
            // Mettez à jour les possibilités dans la même zone
            let startRow = Math.floor(i / 3) * 3;
            let startCol = Math.floor(j / 3) * 3;
            for (let r = startRow; r < startRow + 3; r++) {
                for (let c = startCol; c < startCol + 3; c++) {
                    if (r !== i || c !== j) {
                        if ((r !== i || c !== j) && Array.isArray(possibilities[r][c])) {
                            possibilities[r][c] = possibilities[r][c].filter(num => num !== grid[i][j]);
                        }
                    }
                }
            }
        }
    }

    return possibilities
}

const entropy = (cell) => {
    // console.log(cell)
    if (cell.length > 1) return cell.length
    else return 100
}

const lessEntropyCell = (grid) => {
    let value = 10
    let coI = 0;
    let coJ = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // console.log(i, j)
            const newValue = entropy(grid[i][j])
            if (newValue < value && newValue != 1) {
                value = newValue;
                coI = i;
                coJ = j;
            }
        }
    }
    return [coI, coJ]
}

const solve = (grid) => {
    let possibilities = initialization(grid)
    for (let i = 0; i < 81; i++) {
        let [toChangeRow, toChangeCol] = lessEntropyCell(possibilities)
        console.log(possibilities[toChangeRow][toChangeCol], entropy(possibilities[toChangeRow][toChangeCol]))
        if (grid[toChangeRow][toChangeCol] === 0) {
            if (possibilities[toChangeRow][toChangeCol].length === 0) possibilities[toChangeRow][toChangeCol] = [0]
            let value = possibilities[toChangeRow][toChangeCol][Math.floor(Math.random()*possibilities[toChangeRow][toChangeCol].length)]
            possibilities[toChangeRow][toChangeCol] = value
            grid[toChangeRow][toChangeCol] = value
            for (let j = 0; j < 9; j++) {
                if (Array.isArray(possibilities[toChangeRow][j]) && possibilities[toChangeRow][j].includes(value)) possibilities[toChangeRow][j] = possibilities[toChangeRow][j].filter(n => n !== value)
                if (Array.isArray(possibilities[j][toChangeCol]) && possibilities[j][toChangeCol].includes(value)) possibilities[j][toChangeCol] = possibilities[j][toChangeCol].filter(n => n !== value)
            }
            let startRow = Math.floor(toChangeRow / 3) * 3;
            let startCol = Math.floor(toChangeCol / 3) * 3;
            for (let r = startRow; r < startRow + 3; r++) {
                for (let c = startCol; c < startCol + 3; c++) {
                    if (Array.isArray(possibilities[r][c]) && possibilities[r][c].includes(value)) possibilities[r][c] = possibilities[r][c].filter(n => n !== value)
                }
            }
        }
    }
    console.log(grid)
    return grid
}

let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const sol = solve(solve(solve(grid)))
console.log(sol)


const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
// const mesh = new THREE.Mesh(shape, material)
// scene.add(mesh)  

const cube = new THREE.BoxGeometry(1, 1)
const sphere = new THREE.SphereGeometry()
const dodecahedron = new THREE.DodecahedronGeometry()
const tetrahedron = new THREE.TetrahedronGeometry()

const struc = [0, cube, sphere, 0, 0, 0, 0, 0, 0, 0] // en gros là il faudra imaginer que un cube en fait c'est un pulsar et une sphere c'est un toad par exemple et on remplace

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        if (struc[sol[i][j]] != 0) {
            console.log(struc[sol[i][j]])
            const mesh = new THREE.Mesh(struc[sol[i][j]], material)
            mesh.position.set(i*2, 0, j*2)
            scene.add(mesh)
        }
    }
}

// ----------------------------------------------------------------









// LOOP

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// on applique des règles autant de fois qu'on a défini d'itérations 
animate();