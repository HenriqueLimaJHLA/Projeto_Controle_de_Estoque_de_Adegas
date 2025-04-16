var entries = [];
var valorc = [];
var valorv = [];
var exits = [];
var stock = {};

// Requisição para pegar horario de funcionamento => GET
function GetPopUpValue() {
  $.ajax({
    url: "./real_time/horarioFuncionamento.php",
    method: "GET",
    success: function (data) {
      if (data === null) {
          // INFORMAR QUE NÃO EXISTE HORÁRIOS DEFINIDOS PARA USERS
        }
        else {
          // INFORMAR HORÁRIOS DEFINIDOS PARA USERS
          localStorage.setItem("horario-funcionamento",data)
        }
        
      } 
  })
}
GetPopUpValue();

// Atualiza o status em tempo real
function att_status() {
  const badge = document.querySelector(".span-badge");
  const timeTextElement = document.querySelector(".time_remaining");
  const objectedTextElement = document.querySelector('.objected_remaining');
  const dateTextElement = document.querySelector("#dia_atual_span");

  let interval = JSON.parse(localStorage.getItem("horario-funcionamento"));
  if (!interval) return;

  const now = new Date();
  const daysOfWeek = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const dayOfWeek = daysOfWeek[now.getDay()];
  let start, end, timeRemaining;

  if (interval[dayOfWeek]) {
    [start, end] = interval[dayOfWeek].split('-');
    if (isOpen(start, end)) {
      badge.textContent = "Aberto";
      badge.classList.add('aberto');
      badge.classList.remove('fechado');
      timeRemaining = timeUntil(end);
      objectedTextElement.textContent = "Fecha em:";
    } else {
      badge.textContent = "Fechado";
      badge.classList.add('fechado');
      badge.classList.remove('aberto');
      const nextOpening = findNextOpening(interval, dayOfWeek);
      if (nextOpening) {
        timeRemaining = timeUntil(nextOpening.time, nextOpening.day);
        objectedTextElement.textContent = "Abre em:";
      }
    }
  } else {
    badge.textContent = "Fechado";
    badge.classList.add('fechado');
    badge.classList.remove('aberto');
    const nextOpening = findNextOpening(interval, dayOfWeek);
    if (nextOpening) {
      timeRemaining = timeUntil(nextOpening.time, nextOpening.day);
      objectedTextElement.textContent = "Abre em:";
    }
  }

  if (timeRemaining) {
    const { hours, minutes, seconds } = timeRemaining;
    // console.log(typeof hours)
    let textSaida;
    if(hours >= 24){
      let day = parseInt((hours/24))
      let hourExit = hours%24 
      textSaida = `${day.toString()} dia(s) ${hourExit.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}s`;
    }
    else{
      textSaida = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}s`;
    }
    timeTextElement.textContent = textSaida
  }

  dateTextElement.textContent = now.toLocaleDateString('pt-BR');
}

// Função que verifica se o estabelecimento está aberto
function isOpen(start, end) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const startTime = convertToMinutes(start);
  const endTime = convertToMinutes(end);

  return currentTime >= startTime && currentTime < endTime;
}

// Função que encontra o próximo dia e horário de abertura
function findNextOpening(interval, today) {
  const daysOfWeek = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  let currentIndex = daysOfWeek.indexOf(today);

  for (let i = 1; i <= 7; i++) {  // Limita a busca para uma semana
    const nextDay = daysOfWeek[(currentIndex + i) % 7];
    if (interval[nextDay]) {
      return { day: nextDay, time: interval[nextDay].split('-')[0] };
    }
  }
  return null;
}

//ARRUMAR:
// Função que converte "HH:MM" para minutos totais do dia
function convertToMinutes(timeStr) {
  let [hours, minutes] = timeStr.split(':').map(Number)
  // console.log(hours," ",minutes )
  return hours * 60 + minutes;
}

// Função que calcula o tempo restante até um horário específico sem usar Date
function timeUntil(targetTime, targetDay = null) {
  const now = new Date();
  const daysOfWeek = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  let currentMinutes = (now.getHours() * 60) + now.getMinutes();
  const currentSeconds = now.getSeconds();
  let targetMinutes = convertToMinutes(targetTime);
  let remainingMinutes;

  if (!targetDay) {
    remainingMinutes = targetMinutes - currentMinutes;
    console.log(remainingMinutes)
    if (remainingMinutes < 0) remainingMinutes += 24 * 60;
  } else {   
    let currentIndex = now.getDay(('pt-BR', {weekday: 'short' }));
    let targetIndex = daysOfWeek.indexOf(targetDay);
    let daysToAdd = (targetIndex - currentIndex + 7) % 7;
    remainingMinutes = (daysToAdd * 24 * 60) + (targetMinutes - currentMinutes);
  }

  return {
    hours: Math.floor(remainingMinutes / 60),
    minutes: remainingMinutes % 60,
    seconds: 59 - currentSeconds
  };
}
// Atualiza a cada segundo
document.addEventListener('DOMContentLoaded', () => {
  att_status();
  setInterval(att_status, 1000);
});
