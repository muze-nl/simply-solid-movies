import solidAuthn from 'https://@inrupt/solid-client-authn-browser'
import n3 from "n3"

const getDefaultSession = solidAuthn.getDefaultSession;
const Parser = n3.Parser;

document.getElementById('moviePicker').innerHTML = "Loaded"