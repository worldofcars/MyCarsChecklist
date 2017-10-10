function getXDomainRequest() {
	var xdr = null;
	
	if (window.XDomainRequest) {
		xdr = new XDomainRequest(); 
	} else if (window.XMLHttpRequest) {
		xdr = new XMLHttpRequest(); 
	} else {
		alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
	}
	
	return xdr;	
}

function sendData() {
	document.getElementById('loading').style.display='';
	document.getElementById('listes').innerHTML='';
	var xdr = getXDomainRequest();
	xdr.onload = function() {
        localStorage['mesListes'] = xdr.responseText;
        majListes();
	}
	xdr.onerror = function() {
		alert("Aucune connexion n'a été trouvée pour effectuer la mise à jour");
		document.getElementById('loading').style.display='none';
        majListes();
		latestNews();
	}
	xdr.open("POST", "https://bdd.worldofcars-forum.fr/bddcars/APK/synchro_listes.php", true);
    xdr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xdr.send("collectionneur="+localStorage['login']+"&code="+localStorage['password']);
}
 
function majListes() {
	document.getElementById('latestNews').innerHTML='';
	document.getElementById('meslistes').innerHTML='';
	document.getElementById('listes').innerHTML='';
	var newArr = JSON.parse(localStorage['mesListes']);
	var nomListe = '';
	document.getElementById('latestNews').innerHTML += "<li><a href=\"#\" onclick=\"javascript:latestNews();\">Derni&egrave;re info</a></li>"
	for (i = 1; i < newArr.length; i++) {
	  if (nomListe != newArr[i][3]) {
		  document.getElementById('meslistes').innerHTML += "<li><a href=\"#\" onclick=\"javascript:majListe('"+newArr[i][4]+"');\">"+newArr[i][3]+"</a></li>"
		  nomListe = newArr[i][3];
	  }
	}
	document.getElementById('loading').style.display='none';
	latestNews();
}
 
function latestNews() {
	$.pageslide.close();
	document.getElementById('listes').style.display = 'none';
	localStorage['maListe']='<div class="latestNews"><h1>Derni&egrave;re info</h1>';
	document.getElementById('loading').style.display='';
	var newArr = JSON.parse(localStorage['mesListes']);
	localStorage['maListe'] += newArr[0] + '</div>';		
	document.getElementById('loading').style.display='none';
	document.getElementById('listes').innerHTML = localStorage['maListe'];
	document.getElementById('listes').style.display = '';
}

function majListe(idListe) {
	$.pageslide.close();
	document.getElementById('listes').style.display = 'none';
	localStorage['maListe']='<h1>Liste</h1>';
	document.getElementById('loading').style.display='';
	var newArr = JSON.parse(localStorage['mesListes']);
	var histoire = '';
	var nb_items = 0;
	for (i = 0; i < newArr.length; i++) {
		if (idListe == newArr[i][4]) {
		  nb_items++;		
		  if (histoire != newArr[i][1]) {
		  	  if (histoire != '') {
		  	      localStorage['maListe'] += "</ul>";
		  	  }
			  localStorage['maListe'] += "<h2>" + newArr[i][1] + "</h2><ul>";
			  histoire = newArr[i][1];
		  }
		  if (nb_items<=200) {
              if (newArr[i][2].substr(0,10)!="data:image") { 
				  localStorage['maListe'] += "<li><figure><img src=\"https://bdd.worldofcars-forum.fr/bddcars/images/" + newArr[i][2] + "\"/><figcaption><span>" + newArr[i][0] + "</span></figcaption></figure></li>";
			  } else {
				  localStorage['maListe'] += "<li><figure><img src=\"" + newArr[i][2] + "\"/><figcaption><span>" + newArr[i][0] + "</span></figcaption></figure></li>";
			  }
		  } else {
              if (newArr[i][2].substr(0,10)!="data:image") { 
				  localStorage['maListe'] += "<li><figure><img src=\"loading.gif\" data-original=\"https://bdd.worldofcars-forum.fr/bddcars/images/" + newArr[i][2] +  "\" class=\"img_vehicules\" /><figcaption><span>" + newArr[i][0] + "</span></figcaption></figure></li>";
			  } else {
				  localStorage['maListe'] += "<li><figure><img src=\"loading.gif\" data-original=\"" + newArr[i][2] +  "\" class=\"img_vehicules\" /><figcaption><span>" + newArr[i][0] + "</span></figcaption></figure></li>";
			  }	  
		  }
		}
	}
	document.getElementById('loading').style.display='none';
	document.getElementById('listes').innerHTML = localStorage['maListe'];
	document.getElementById('listes').style.display = '';
	$(".img_vehicules").lazyload({ 
    	effect : "fadeIn"
	});

}
 