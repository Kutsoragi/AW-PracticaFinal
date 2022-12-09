module.exports = {
    parseoCategorias : function(cat){
        switch(cat){
            
        }
    },

    validarCategoria : function(cat,perfil){
        switch(perfil){
            case 'alumno': 
                    switch(cat){
                        case 'cfisica': return true;
                        case 'cpublico': return false;
                        case 'registroElec': return true;
                        case 'sede': return true;
                        case 'portafirmas': return false;

                        case 'correo': return true;
                        case 'meet': return true;
                        case 'calumno': return true;
                        case 'cpersonal': return false;
                        case 'cgenerica': return false;
                    }
                break;
            
        }
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
    }   

}