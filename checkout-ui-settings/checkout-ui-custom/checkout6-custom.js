// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

window.onload = function () {
  if (document.querySelector('.client-profile-data .accordion-toggle span'))
    document.querySelector('.client-profile-data .accordion-toggle span').innerText = "informações pessoais";

  if (document.querySelector('.client-notice'))
    document.querySelector('.client-notice').innerText = "Solicitamos apenas informações essenciais.";

  if (document.querySelector('.client-email label'))
    document.querySelector('.client-email label').innerText = "email*";

  if (document.querySelector('.client-first-name label'))
    document.querySelector('.client-first-name label').innerText = "Primeiro nome*";

  if (document.querySelector('.client-last-name label'))
    document.querySelector('.client-last-name label').innerText = "Último nome*";

  if (document.querySelector('.client-document label'))
    document.querySelector('.client-document label').innerText = "CPF*";

  if (document.querySelector('.client-phone label'))
    document.querySelector('.client-phone label').innerText = "telefone*";

  if (document.querySelector('.box-client-info .newsletter'))
    document.querySelector('.box-client-info .newsletter').insertAdjacentHTML('beforebegin',
      '<p class="authorize-data"><span class="authorize-data-title">Ofertas</span>Autorizo o uso dos meus dados para recebimento de notificações, dicas, oferta e promoções do GIGA Atacadista com <br/>base no meu perfil, através de:</p>');

  if (document.querySelector('#unavailable-delivery-disclaimer'))
    document.querySelector('#unavailable-delivery-disclaimer').innerHTML = "Alguns itens estão indisponíveis no ponto selecionado.<br/>Preencha seus dados de entrega para recebê-los.";
};
