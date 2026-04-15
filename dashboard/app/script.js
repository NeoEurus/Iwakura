let currentIP = "";
let map;

const t = {
    es: {
        title:"Tu Red",
        copy:"Copiar IP",
        safe:"Seguro",
        risk:"Riesgo",
        vpn:"VPN"
    },
    en: {
        title:"Your Network",
        copy:"Copy IP",
        safe:"Safe",
        risk:"Risk",
        vpn:"VPN"
    }
};

let lang = "es";

document.getElementById("lang").onchange = e=>{
    lang = e.target.value;
    init();
};

function box(t,v){
    return `<div class="box"><b>${t}</b><br>${v||"-"}</div>`;
}

function vpnCheck(d){
    if (d.vpn !== null) return d.vpn;

    if (!d.isp) return false;

    let k = ["vpn","proxy","cloud","server","hosting","aws","google","azure"];
    return k.some(x => d.isp.toLowerCase().includes(x));
}

function badges(d){
    let html="";
    let vpn = vpnCheck(d);

    html += `<div class="badge ${vpn?"bad":"good"}">
        ${vpn?"VPN/Proxy":"Seguro"}
    </div>`;

    html += `<div class="badge ${d.version==="IPv6"?"good":"warn"}">
        ${d.version || "IP"}
    </div>`;

    html += `<div class="badge ${d.asn?"good":"warn"}">
        ASN
    </div>`;

    return html;
}

async function getData(){
    try {
        let r = await fetch('https://ipapi.co/json/');
        let d = await r.json();

        if (!d.ip) throw 0;

        return {
            ip: d.ip,
            country: d.country_name,
            code: d.country,
            city: d.city,
            region: d.region,
            isp: d.org,
            asn: d.asn,
            timezone: d.timezone,
            currency: d.currency,
            lat: d.latitude,
            lon: d.longitude,
            postal: d.postal,
            version: d.version,
            org: d.org,
            vpn: null
        };

    } catch {
        let r = await fetch('https://ipwho.is/');
        let d = await r.json();

        return {
            ip: d.ip,
            country: d.country,
            code: d.country_code,
            city: d.city,
            region: d.region,
            isp: d.isp,
            asn: d.connection?.asn,
            timezone: d.timezone?.id,
            currency: d.currency?.code,
            lat: d.latitude,
            lon: d.longitude,
            postal: d.postal,
            version: d.type,
            org: d.connection?.org,
            vpn: d.security?.vpn || d.security?.proxy || false
        };
    }
}

function render(d){
    currentIP = d.ip;

    document.getElementById("title").innerText = t[lang].title;
    document.getElementById("copyBtn").innerText = t[lang].copy;

    document.getElementById("badges").innerHTML = badges(d);

    document.getElementById("info").classList.remove("skeleton");
    document.getElementById("info").innerHTML = `
        ${box("IP", d.ip)}
        ${box("Tipo IP", d.version)}
        ${box("País", d.country + " ("+d.code+")")}
        ${box("Ciudad", d.city)}
        ${box("Región", d.region)}
        ${box("Código postal", d.postal)}

        ${box("ISP", d.isp)}
        ${box("Organización", d.org)}
        ${box("ASN", d.asn)}

        ${box("Zona horaria", d.timezone)}
        ${box("Moneda", d.currency)}

        ${box("Coordenadas", d.lat + ", " + d.lon)}
        ${box("VPN / Proxy", vpnCheck(d) ? "🛑 Sí" : "🟢 No")}
    `;

    if(map) map.remove();

    map = L.map('map').setView([d.lat, d.lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'© OpenStreetMap'
    }).addTo(map);

    L.marker([d.lat, d.lon]).addTo(map);
}

function copyIP(){
    if(!currentIP) return;
    navigator.clipboard.writeText(currentIP);
    document.getElementById("status").innerText = "✔";
}

async function init(){
    try{
        let d = await getData();
        render(d);
    }catch{
        document.getElementById("info").innerHTML = "error";
    }
}

init();
