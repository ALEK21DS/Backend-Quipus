// Utilidades para calcular puntuaciones del juego

// Calcular bonus por tiempo (genérico)
const calcularBonusTiempo = (tiempoRespuesta, tiempoMaximo) => {
  if (tiempoRespuesta <= tiempoMaximo * 0.3) return 50; // Muy rápido
  if (tiempoRespuesta <= tiempoMaximo * 0.6) return 30; // Rápido  
  if (tiempoRespuesta <= tiempoMaximo * 0.8) return 15; // Normal
  return 0; // Lento
};

// Calcular bonus por tiempo específico para Reto 1 (muy exigente)
const calcularBonusTiempoReto1 = (tiempoRespuesta) => {
  if (tiempoRespuesta <= 5) return 50; // Muy rápido: ≤5 segundos
  if (tiempoRespuesta <= 10) return 30; // Rápido: ≤10 segundos
  if (tiempoRespuesta <= 15) return 15; // Normal: ≤15 segundos
  return 0; // Lento: >15 segundos
};

// Calcular bonus por tiempo específico para Reto 2 (muy exigente)
const calcularBonusTiempoReto2 = (tiempoRespuesta) => {
  if (tiempoRespuesta <= 15) return 50; // Muy rápido: ≤15 segundos
  if (tiempoRespuesta <= 30) return 30; // Rápido: ≤30 segundos
  if (tiempoRespuesta <= 45) return 15; // Normal: ≤45 segundos
  return 0; // Lento: >45 segundos
};

// Calcular bonus por tiempo específico para Reto 3 (muy exigente)
const calcularBonusTiempoReto3 = (tiempoRespuesta) => {
  if (tiempoRespuesta <= 30) return 50; // Muy rápido: ≤30 segundos
  if (tiempoRespuesta <= 60) return 30; // Rápido: ≤60 segundos
  if (tiempoRespuesta <= 90) return 15; // Normal: ≤90 segundos
  return 0; // Lento: >90 segundos
};

// Calcular puntuación base según intento
const calcularPuntuacionBase = (intentoNumero) => {
  switch(intentoNumero) {
    case 1: return 100; // 1er intento
    case 2: return 50;  // 2do intento
    case 3: return 25;  // 3er intento
    default: return 0;
  }
};

// Calcular puntuación para una pregunta individual del Reto 1
const calcularPuntuacionPreguntaReto1 = (intentoNumero, tiempoRespuesta, tiempoMaximo = 120) => {
  const puntuacionBase = calcularPuntuacionBase(intentoNumero);
  const bonusTiempo = calcularBonusTiempoReto1(tiempoRespuesta);
  return puntuacionBase + bonusTiempo;
};

// Calcular puntuación total del Reto 1 (suma de las 4 preguntas)
const calcularPuntuacionTotalReto1 = (respuestas) => {
  return respuestas.reduce((total, respuesta) => {
    return total + respuesta.puntuacionTotal;
  }, 0);
};

// Calcular puntuación para una pregunta individual del Reto 2
const calcularPuntuacionPreguntaReto2 = (intentoNumero, tiempoRespuesta, tiempoMaximo = 180) => {
  const puntuacionBase = calcularPuntuacionBase(intentoNumero);
  const bonusTiempo = calcularBonusTiempoReto2(tiempoRespuesta);
  return puntuacionBase + bonusTiempo;
};

// Calcular puntuación para una validación individual del Reto 3
const calcularPuntuacionValidacion = (intentoNumero, tiempoRespuesta, tiempoMaximo = 300) => {
  const puntuacionBase = calcularPuntuacionBase(intentoNumero);
  const bonusTiempo = calcularBonusTiempoReto3(tiempoRespuesta);
  return puntuacionBase + bonusTiempo;
};

// Calcular puntuación total de un ejercicio del Reto 3
const calcularPuntuacionEjercicioReto3 = (
  validacion1, // { correcta, intento, tiempo }
  validacion2, // { correcta, intento, tiempo }
  validacion3  // { correcta, intento, tiempo }
) => {
  let puntuacionTotal = 0;
  
  // Solo sumar puntos si la validación es correcta
  if (validacion1.correcta) {
    puntuacionTotal += calcularPuntuacionValidacion(validacion1.intento, validacion1.tiempo);
  }
  
  if (validacion2.correcta) {
    puntuacionTotal += calcularPuntuacionValidacion(validacion2.intento, validacion2.tiempo);
  }
  
  if (validacion3.correcta) {
    puntuacionTotal += calcularPuntuacionValidacion(validacion3.intento, validacion3.tiempo);
  }
  
  return puntuacionTotal;
};

// Calcular puntuación para tabla de notas (solo ejercicios completados del Reto 3)
const calcularPuntuacionNotas = (ejerciciosCompletados) => {
  // Máximo 10 ejercicios, puntuación 0-10
  return Math.min(ejerciciosCompletados, 10);
};

module.exports = {
  calcularBonusTiempo,
  calcularBonusTiempoReto1,
  calcularBonusTiempoReto2,
  calcularBonusTiempoReto3,
  calcularPuntuacionBase,
  calcularPuntuacionPreguntaReto1,
  calcularPuntuacionTotalReto1,
  calcularPuntuacionPreguntaReto2,
  calcularPuntuacionValidacion,
  calcularPuntuacionEjercicioReto3,
  calcularPuntuacionNotas
};
