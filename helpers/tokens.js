

const generarToken = () => Math.random().toString(32).substring(2) + Date.now().toString();


export {
    generarToken
}