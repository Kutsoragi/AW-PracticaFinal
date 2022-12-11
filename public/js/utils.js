module.exports = {

    

    

    parseFecha : function(date){
        let currentDate = date
        let month = currentDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        let dateOfMonth = currentDate.getDate();
        if (dateOfMonth < 10) dateOfMonth = "0" + dateOfMonth;
        let year = currentDate.getFullYear();
        let hours = currentDate.getHours() + 1;
        let mins = currentDate.getMinutes();
        if (mins < 10) mins = "0" + mins;
        let formattedDate = dateOfMonth + "/" + month + "/" + year + " " + hours + ":" + mins;
        return formattedDate;
    },

    findByTag : function(tasks, tag){
        return tasks.filter(task => task.tags.includes(tag));
    },

    findByTags : function(tasks, tags){
        return tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
    },

    countDone : function(tasks){
        return tasks.filter(task => task.done).length;
    },

    createTasks : function(text){
        let array = text.split(" ");
        let tagsAux = array.filter(a => a.startsWith("@"));
        tagsAux = tagsAux.map(t => t.substring(1));
        let textoAux = array.filter(a => !a.startsWith("@"));
        textoAux = textoAux.join(" ");
        return {text: textoAux, tags: tagsAux, done:false };
    },

    parsePerfil : function(p){
        switch(p){
            case 'alumno': return "Alumno";
            case 'pdi': return "PDI";
            case 'pas': return "PAS";
            case 'aa' : return "Antiguo Alumno";
            default: return "Perfil no contemplado";
        }
    },

    parseTipo : function(t){
        switch(t){
            case 'felicitacion': return "Felicitación";
            case 'incidencia': return "Incidencia";
            case 'sugerencia': return "Sugerencia";
            default: return "Tipo no contemplado";
        }
    },
    
    parseCategorias : function(cat){
        switch(cat){
            //administracion digital
            case 'cfisica': return "Certificado digital de persona física";
            case 'cpublico': return "Certificado electrónico de empleado público";
            case 'registroElec': return "Registro electrónico";
            case 'sede': return "Sede electrónica";
            case 'portafirmas': return "Portafirmas";

            //comunicaciones
            case 'correo': return "Correo electrónico";
            case 'meet': return "Google Meet";
            case 'calumno': return "Cuenta de alumno";
            case 'cpersonal': return "Cuenta de personal";
            case 'cgenerica': return "Cuenta genérica";

            //conectividad
            case 'sara': return "Cuenta as la Red SARA";
            case 'conex': return "Conexión por cable en despachos";
            case 'cortafuegos': return "Cortafuegos corporativo";
            case 'dns': return "Resolución de nombres de dominio (DNS)";
            case 'vpn': return "VPN Acceso remoto";
            case 'eduroam': return "Wifi Eduroam (ssid: eduroam)";
            case 'wifivis': return "Wifi para visitantes (ssid: UCM-Visitantes)";

            //docencia
            case 'aula': return "Aula Virtual";
            case 'blackboard': return "Blackboard Collaborate";
            case 'listados': return "Listados de clase";
            case 'moodle': return "Moodle: Aula Global";
            case 'cursosprivados': return "Plataforma de cursos online privados";

            //web
            case 'analitica': return "Analitica Web";
            case 'ssl': return "Emisión de certificados SSL";
            case 'hosting': return "Hosting: alojamiento de páginas web";
            case 'portal': return "Portal de eventos";
            case 'redirecciones': return "Redirecciones web";

             //felicitacion
             case 'archivo': return "Archivo Universitario";
             case 'asesoria': return "Asesoría Jurídica";
             case 'biblioteca': return "Biblioteca";
             case 'cInfo': return "Centro de Información";
             case 'dDocentes': return "Departamentos docentes";
             case 'iServicios': return "Inspección de Servicios";
             case 'ofGest': return "Oficina de Gestión de Infraestructuras y Mantenimiento";
             case 'sAdmin': return "Servicio de Administracion";
             case 'sInfor': return "Servicios Informáticos";
             case 'sDocu': return "Servicio de Documentación";
             case 'sImp': return "Servicio de Imprenta";
             case 'sCafe': return "Servicio de Cafetería";
             case 'todauni': return "Toda la universidad";

             //categorias
             case 'adigital': return "Administración digital";
             case 'comu': return "Comunicaciones";
             case 'conect': return "Conectividad";
             case 'docencia': return "Docencia";
             case 'web': return "Web";
             
             default: return "Categoría no contemplada";
        
            
        }
    }

}