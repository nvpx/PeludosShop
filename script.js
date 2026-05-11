// ==========================================
// 1. BASE DE DATOS DE PRODUCTOS
// ==========================================
const productos = [
    {
        nombre: "IDENTIFICACIÓN",
        precio: "3.999",
        imagenes: [
            "img/art1.jpg", 
            "img/Art1.2.png",
            "img/art1.3.jpg"
        ]
    },
    {
        nombre: "CORREA Y ARNES",
        precio: "17.999",
        imagenes: [
            "img/art2.png",
            "img/art2.png" 
        ]
    },
    {
        nombre: "CORREA Y COLLAR",
        precio: "13.999",
        imagenes: [
            "img/art3.png", 
            "img/art3.1.png"
        ]
    },
    {
        nombre: "LLAVERO 3D",
        precio: "3.999",
        imagenes: [
            "img/art4.jpg", 
            "img/art4.1.jpg"
        ]
    }
];

// ==========================================
// 2. VARIABLES GLOBALES
// ==========================================
let carrito = [];
const catalogo = document.getElementById('catalogo');

// ==========================================
// 3. FUNCIÓN PARA MOSTRAR PRODUCTOS
// ==========================================
function cargarProductos() {
    if (!catalogo) return; 
    
    catalogo.innerHTML = ""; 

    productos.forEach((p, index) => {
        const card = document.createElement('article');
        card.className = 'producto';
        
        const tieneVarias = p.imagenes.length > 1;
        const indicador = tieneVarias ? '<span class="multi-fotos">📷 +1</span>' : '';

        card.innerHTML = `
            <div class="contenedor-img">
                <img src="${p.imagenes[0]}" 
                     alt="${p.nombre}" 
                     class="img-producto" 
                     data-index="0" 
                     data-prod-id="${index}">
                ${indicador}
            </div>
            <h3>${p.nombre}</h3>
            <span class="precio">$${p.precio}</span>
            <button class="boton-comprar" onclick="agregarAlCarrito(${index})">AGREGAR AL CARRITO</button>
        `;
        catalogo.appendChild(card);
    });
}

// ==========================================
// 4. LÓGICA DEL CARRITO
// ==========================================
function agregarAlCarrito(index) {
    carrito.push(productos[index]);
    actualizarInterfazCarrito();
    
    const btnFlotante = document.getElementById('btn-carrito-flotante');
    if(btnFlotante) {
        btnFlotante.style.transform = "scale(1.2)";
        setTimeout(() => btnFlotante.style.transform = "scale(1)", 200);
    }
}

function actualizarInterfazCarrito() {
    const contador = document.getElementById('contador-carrito');
    const lista = document.getElementById('lista-carrito');
    const totalElem = document.getElementById('precio-total');
    
    if(!contador || !lista || !totalElem) return;

    contador.innerText = carrito.length;
    lista.innerHTML = "";
    
    let total = 0;

    carrito.forEach((item, index) => {
        // Quitamos los puntos para poder sumar matemáticamente
        const precioLimpio = parseFloat(item.precio.replace(/\./g, ''));
        total += precioLimpio;

        lista.innerHTML += `
            <div class="item-carrito" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span style="font-size:0.9rem;">${item.nombre}</span>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:bold;">$${item.precio}</span>
                    <button onclick="quitarDelCarrito(${index})" style="color:red; background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
                </div>
            </div>
        `;
    });

    totalElem.innerText = total.toLocaleString('es-AR');
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarInterfazCarrito();
}

// ==========================================
// 5. ENVÍO A WHATSAPP (Conectado)
// ==========================================
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    // --- CONFIGURA TU NÚMERO AQUÍ (Solo números, sin el +) ---
    const telefono = "5491158763846"; 

    let mensaje = "¡Hola Peludos Shop! 🐾 Quisiera realizar este pedido:\n\n";
    
    carrito.forEach((item, i) => {
        mensaje += `*${i+1}.* ${item.nombre} ($${item.precio})\n`;
    });

    const totalFinal = document.getElementById('precio-total').innerText;
    mensaje += `\n*Total a pagar: $${totalFinal}*`;
    mensaje += "\n\n¿Me indican cómo proceder con el pago? Gracias.";

    // Esta es la forma más compatible para móviles:
    const url = "https://api.whatsapp.com/send?phone=" + telefono + "&text=" + encodeURIComponent(mensaje);
    
    // Cambiamos window.open por esto:
    window.location.href = url;
}

// ==========================================
// 6. INTERACCIÓN Y MODALES
// ==========================================
function abrirCarrito() { document.getElementById('modal-carrito').style.display = 'flex'; }
function cerrarCarrito() { document.getElementById('modal-carrito').style.display = 'none'; }

if(catalogo) {
    catalogo.addEventListener('click', (e) => {
        if (e.target.classList.contains('img-producto')) {
            const imgElement = e.target;
            const prodId = imgElement.getAttribute('data-prod-id');
            const currentIdx = parseInt(imgElement.getAttribute('data-index'));
            const fotos = productos[prodId].imagenes;

            // Si tiene más fotos, rotamos la imagen en el catálogo
            if (fotos.length > 1) {
                let nextIdx = (currentIdx + 1) % fotos.length;
                imgElement.src = fotos[nextIdx];
                imgElement.setAttribute('data-index', nextIdx);
            }

            // Mostramos el zoom con la imagen actual
            const modalZoom = document.getElementById('modal-zoom');
            const imgG = document.getElementById('imgG');
            if(modalZoom && imgG) {
                modalZoom.style.display = 'flex';
                imgG.src = imgElement.src;
            }
        }
    });
}

// ==========================================
// 7. INICIO
// ==========================================
document.addEventListener('DOMContentLoaded', cargarProductos);
