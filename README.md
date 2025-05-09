# 🥂 Team Drinks – Proyecto Web con Autenticación Facial + API Pública

Este proyecto web permite a los usuarios **registrarse e iniciar sesión utilizando su rostro** mediante la API de Face++, y luego acceder a una galería de **cocteles aleatorios** consumidos desde la API pública de TheCocktailDB. Todo el flujo está implementado del lado del cliente, sin backend.

---

## 🔧 Tecnologías utilizadas

- HTML5 + CSS3 (interfaz neón responsiva)
- JavaScript (ES6)
- API privada: Face++ (https://console.faceplusplus.com/)
- API pública: TheCocktailDB (https://www.thecocktaildb.com/)

---

## 📷 Flujo general de la aplicación

### 1. Inicio y cámara activada  
El usuario accede a la página principal donde se muestra la cámara en vivo.  

![image](https://github.com/user-attachments/assets/bb601784-f182-409b-adea-f7f5b057128e)

### 2. Registro facial  
Al presionar el botón "Registrar rostro", se captura una imagen y se registra con la API de Face++ en un FaceSet.  

![image](https://github.com/user-attachments/assets/14b5217f-1c3e-4b17-9166-3f97dc11d08c)

### 3. Inicio de sesión facial  
Se verifica el rostro contra los registros existentes. Si coincide, se permite el acceso.  


### 4. Visualización de cocteles  
Después del login exitoso, se muestran 6 cocteles aleatorios con imagen, nombre, tipo, categoría y vaso recomendado.  

![image](https://github.com/user-attachments/assets/3e8e3963-c450-4403-a2c5-641dcb406b8d)

---

## 📁 Estructura del proyecto

![image](https://github.com/user-attachments/assets/c82d1b72-c4db-4247-959d-a4b1569a7e07)
