/**
 * Roulette game logic and UI
 * Modern, simple implementation with Tailwind CSS styling
 */

function initRoulette() {
  const container = document.getElementById('roulette-game');
  container.innerHTML = `
    <h2 class="text-3xl font-bold mb-4 text-red-500">Roulette</h2>
    <div class="flex flex-col md:flex-row gap-6">
      <div class="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col items-center">
        <canvas id="roulette-wheel" width="400" height="400" class="rounded-full shadow-lg"></canvas>
        <button id="spin-button" class="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white font-semibold transition">Spin</button>
      </div>
      <div class="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg text-center">
        <h3 class="text-xl font-semibold mb-4">Place your bet</h3>
        <div id="bet-options" class="grid grid-cols-3 gap-3 max-w-xs mx-auto"></div>
        <p id="bet-message" class="mt-4 text-yellow-400 font-semibold"></p>
        <p id="result-message" class="mt-6 text-lg font-bold"></p>
      </div>
    </div>
  `;

  const canvas = document.getElementById('roulette-wheel');
  const ctx = canvas.getContext('2d');
  const spinButton = document.getElementById('spin-button');
  const betOptionsDiv = document.getElementById('bet-options');
  const betMessageP = document.getElementById('bet-message');
  const resultMessageP = document.getElementById('result-message');

  const segments = [
    { label: '0', color: '#2ecc71' },
    { label: '32', color: '#e74c3c' },
    { label: '15', color: '#000000' },
    { label: '19', color: '#e74c3c' },
    { label: '4', color: '#000000' },
    { label: '21', color: '#e74c3c' },
    { label: '2', color: '#000000' },
    { label: '25', color: '#e74c3c' },
    { label: '17', color: '#000000' },
    { label: '34', color: '#e74c3c' },
    { label: '6', color: '#000000' },
    { label: '27', color: '#e74c3c' },
    { label: '13', color: '#000000' },
    { label: '36', color: '#e74c3c' },
    { label: '11', color: '#000000' },
    { label: '30', color: '#e74c3c' },
    { label: '8', color: '#000000' },
    { label: '23', color: '#e74c3c' },
    { label: '10', color: '#000000' },
    { label: '5', color: '#e74c3c' },
    { label: '24', color: '#000000' },
    { label: '16', color: '#e74c3c' },
    { label: '33', color: '#000000' },
    { label: '1', color: '#e74c3c' },
    { label: '20', color: '#000000' },
    { label: '14', color: '#e74c3c' },
    { label: '31', color: '#000000' },
    { label: '9', color: '#e74c3c' },
    { label: '22', color: '#000000' },
    { label: '18', color: '#e74c3c' },
    { label: '29', color: '#000000' },
    { label: '7', color: '#e74c3c' },
    { label: '28', color: '#000000' },
    { label: '12', color: '#e74c3c' },
    { label: '35', color: '#000000' },
    { label: '3', color: '#e74c3c' },
    { label: '26', color: '#000000' },
  ];

  let currentAngle = 0;
  let spinning = false;
  let selectedBet = null;

  function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const segmentAngle = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, index) => {
      const startAngle = currentAngle + index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(segment.label, radius - 10, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 15, centerY - radius + 20);
    ctx.lineTo(centerX + 15, centerY - radius + 20);
    ctx.closePath();
    ctx.fillStyle = '#f00';
    ctx.fill();
  }

  function animateSpin(duration, finalAngle) {
    const start = performance.now();
    const initialAngle = currentAngle;

    function animate(time) {
      const elapsed = time - start;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle = initialAngle + easeOut * (finalAngle - initialAngle);
        drawWheel();
        requestAnimationFrame(animate);
      } else {
        currentAngle = finalAngle % (2 * Math.PI);
        drawWheel();
        spinning = false;
        determineResult();
      }
    }
    requestAnimationFrame(animate);
  }

  function determineResult() {
    const segmentAngle = (2 * Math.PI) / segments.length;
    const index = Math.floor(((2 * Math.PI) - currentAngle + segmentAngle / 2) / segmentAngle) % segments.length;
    const winningSegment = segments[index];
    resultMessageP.textContent = `Gewonnen: ${winningSegment.label}`;
    if (selectedBet === winningSegment.label) {
      betMessageP.textContent = 'Herzlichen Glückwunsch! Sie haben gewonnen!';
    } else {
      betMessageP.textContent = 'Leider verloren. Versuchen Sie es erneut.';
    }
  }

  function createBetOptions() {
    betOptionsDiv.innerHTML = '';
    segments.forEach(segment => {
      const btn = document.createElement('button');
      btn.textContent = segment.label;
      btn.className = 'bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition';
      btn.addEventListener('click', () => {
        selectedBet = segment.label;
        betMessageP.textContent = `Sie haben auf ${selectedBet} gesetzt.`;
        resultMessageP.textContent = '';
      });
      betOptionsDiv.appendChild(btn);
    });
  }

  spinButton.addEventListener('click', () => {
    if (spinning) return;
    if (!selectedBet) {
      betMessageP.textContent = 'Bitte wählen Sie zuerst eine Zahl zum Setzen.';
      return;
    }
    spinning = true;
    betMessageP.textContent = 'Dreht...';
    resultMessageP.textContent = '';
    const spins = Math.floor(Math.random() * 5) + 5;
    const segmentAngle = (2 * Math.PI) / segments.length;
    const finalIndex = Math.floor(Math.random() * segments.length);
    const finalAngle = spins * 2 * Math.PI + finalIndex * segmentAngle;
    animateSpin(4000, finalAngle);
  });

  createBetOptions();
  drawWheel();
}
