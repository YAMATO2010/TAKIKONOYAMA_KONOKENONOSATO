let originalText = '';

// ひらがな→ローマ字変換マップ
const romajiMap = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'di','づ':'du','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'じゃ':'ja','じゅ':'ju','じょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'ー':'-','っ':'','里':'ri','山':'zan'
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function kt() {
  const ktlist = ['き',"の","こ" ,"の","山","た","け","の","こ","の","里"];
  shuffle(ktlist);  
  const display = document.getElementById('display');
  display.classList.remove('fade');
  const result = ktlist.join('');
  setTimeout(() => {
    originalText = result;
    display.innerText = result;
    display.classList.add('fade');
  }, 10);
  if (result.includes("きのこの山") && result.includes("たけのこの里")) {
    kenkaAnimation({imageSrc: 'kenka_businessman.png'});
  }
}

function kt2() {
  const ktlist = ['き',"の","こ" ,"た","け","の","こ"];
  shuffle(ktlist);  
  const display = document.getElementById('display');
  display.classList.remove('fade');
  const result = ktlist.join('');
  setTimeout(() => {
    originalText = result;
    display.innerText = result;
    display.classList.add('fade');
  }, 10);
  if (result.includes("きのこ") && result.includes("たけのこ")) {
    kenkaAnimation({imageSrc: 'kenka_businessman.png'});
  }
}

function copyToClipboard() {
  const text = document.getElementById('display').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('コピーしました！\n\n' + text);
  }).catch(err => {
    console.error('コピーに失敗しました', err);
  });
}

function speakText() {
  const text = document.getElementById('display').innerText;
  if (!text) {
    alert('テキストがありません');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function shareText() {
  const text = document.getElementById('display').innerText;
  if (!text) {
    alert('テキストがありません');
    return;
  }
  if (navigator.share) {
    navigator.share({
      title: 'たきこの山このけのの里',
      text: text
    }).catch(err => console.log('Share cancelled'));
  } else {
    alert('このブラウザではシェア機能は対応していません');
  }
}

async function convertToRomaji() {
  const text = document.getElementById('display').innerText;
  if (!text) {
    alert('テキストがありません');
    return;
  }
  
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    // 2文字の組み合わせをチェック（拗音など）
    if (i + 1 < text.length && romajiMap[text.substring(i, i + 2)]) {
      result += romajiMap[text.substring(i, i + 2)];
      i += 2;
    }
    // 1文字の変換
    else if (romajiMap[text[i]]) {
      result += romajiMap[text[i]];
      i++;
    }
    // マップにない文字はそのまま
    else {
      result += text[i];
      i++;
    }
  }
  
  document.getElementById('display').innerText = result;
}

function restoreJapanese() {
  if (!originalText) {
    alert('元のテキストがありません');
    return;
  }
  document.getElementById('display').innerText = originalText;
}

// kenka アニメーション: 奥から現れて増殖し、跳ね回って消える
function kenkaAnimation(options = {}) {
  const opts = Object.assign({
    emoji: '💥',
    maxCount: 80,
    life: 4500,
    spawnInterval: 60,
    containerClass: 'kenka-container'
  }, options);

  const container = document.createElement('div');
  container.className = opts.containerClass;
  document.body.appendChild(container);

  const particles = [];
  let spawned = 0;

  function createParticle(fromX, fromY, depth = Math.random()) {
    const useImage = !!opts.imageSrc;
    let el;
    if (useImage) {
      el = document.createElement('img');
      el.src = opts.imageSrc;
      el.alt = '';
      el.className = 'kenka';
      el.style.position = 'absolute';
      el.style.pointerEvents = 'none';
      el.style.userSelect = 'none';
    } else {
      el = document.createElement('div');
      el.className = 'kenka';
      el.innerText = opts.emoji;
    }
    if (Math.random() < 0.25) el.classList.add('kenka--small');
    if (Math.random() < 0.15) el.classList.add('kenka--large');
    container.appendChild(el);

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    // 発生位置（奥から現れるので中央下寄りを基準）
    const x = (fromX != null) ? fromX : w / 2 + (Math.random() - 0.5) * 60;
    const y = (fromY != null) ? fromY : h * 0.75 + (Math.random() - 0.5) * 30;

    // depth: 0..1, 小さいほど遠く（小さく、遅い）
    const scale = 0.4 + depth * 1.2;
    const baseSize = useImage ? (36 + Math.random() * 40) : (20 + Math.random() * 24);

    const p = {
      el,
      x,
      y,
      vx: (Math.random() - 0.5) * 8 * (0.6 + depth),
      vy: - (4 + Math.random() * 8) * (0.6 + depth),
      scale,
      created: performance.now(),
      life: opts.life * (0.8 + Math.random() * 0.6),
      bounces: 0,
      baseSize
    };

    // 画像なら幅を指定して、transform はスケール補正に使う
    if (useImage) {
      el.style.width = (baseSize * scale) + 'px';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = `translate(-50%,-50%) scale(${0.6})`;
    } else {
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = `translate(-50%,-50%) scale(${scale * 0.6})`;
      el.style.opacity = '1';
    }

    particles.push(p);
    spawned++;
    return p;
  }

  // 衝突時の爆発を作る
  function spawnExplosion(x, y) {
    const ex = document.createElement('div');
    ex.className = 'kenka-explosion';
    ex.innerText = '💥';
    container.appendChild(ex);
    ex.style.left = x + 'px';
    ex.style.top = y + 'px';
    // 自動削除（アニメーション終了後）
    setTimeout(() => { try { ex.remove(); } catch (e) {} }, 700);
  }

  // 初期1体を奥から現れさせ、増殖フェーズへ
  const w = window.innerWidth;
  const h = window.innerHeight;
  // 画像使用時は初回もランダム位置に出現させる
  const initialX = opts.imageSrc ? (Math.random() * w) : (w / 2);
  const initialY = opts.imageSrc ? (h * (0.2 + Math.random() * 0.6)) : (h * 0.85);
  createParticle(initialX, initialY, 0.05);

  // 増殖フェーズ: 一定間隔で倍増に近いペースでスポーン
  const spawnTimer = setInterval(() => {
    if (spawned >= opts.maxCount) {
      clearInterval(spawnTimer);
      return;
    }
    // 現在の粒子数に応じて追加数を決める（急速に増える）
    const toAdd = Math.min(opts.maxCount - spawned, Math.max(1, Math.floor(spawned * 0.4) + 1));
    for (let i = 0; i < toAdd; i++) {
      let fx, fy;
      if (opts.imageSrc) {
        // 画像使用時は画面内のランダム位置に出現
        fx = Math.random() * w;
        fy = h * (0.2 + Math.random() * 0.7); // 20%〜90% の高さ
      } else {
        // 元の挙動: 既存パーティクル付近から出現
        const ref = particles[Math.floor(Math.random() * particles.length)];
        fx = (ref ? ref.x : w / 2) + (Math.random() - 0.5) * 40;
        fy = (ref ? ref.y : h * 0.75) + (Math.random() - 0.5) * 40;
      }
      createParticle(fx, fy, Math.random());
    }
  }, opts.spawnInterval);

  // アニメーションループ（物理：重力 + 跳ね返り）
  let rafId = null;
  function step(now) {
    const gravity = 0.5;
    const damping = 0.85;
    const floorY = container.clientHeight - 30;
    const leftBound = 0;
    const rightBound = container.clientWidth;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = now - p.created;
      // 経過でフェード
      const t = age / p.life;
      if (t >= 1) {
        // 消える
        p.el.style.opacity = '0';
        p.el.remove();
        particles.splice(i, 1);
        continue;
      }

      p.vy += gravity * (0.9 + Math.random() * 0.2);
      p.x += p.vx;
      p.y += p.vy;

      // 衝突判定（他のパーティクルと接触したら爆発を表示）
      for (let j = i - 1; j >= 0; j--) {
        const q = particles[j];
        if (!q) continue;
        // recent collision 再発を抑制
        if (p._recentCollide && q._recentCollide) continue;
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        const minDist = (p.baseSize * p.scale + q.baseSize * q.scale) * 0.5;
        if (dist < Math.max(8, minDist * 0.8)) {
          // 中間点に爆発を表示
          spawnExplosion((p.x + q.x) / 2, (p.y + q.y) / 2);
          // 反発を強める
          p.vx *= -0.6; q.vx *= -0.6;
          p.vy *= -0.6; q.vy *= -0.6;
          p._recentCollide = true; q._recentCollide = true;
          // 一定時間後に再び衝突を許す
          setTimeout(() => { p._recentCollide = false; q._recentCollide = false; }, 350);
        }
      }

      // 壁バウンス
      if (p.x < leftBound + 10) { p.x = leftBound + 10; p.vx = -p.vx * damping; }
      if (p.x > rightBound - 10) { p.x = rightBound - 10; p.vx = -p.vx * damping; }

      // 床バウンス
      if (p.y > floorY) {
        p.y = floorY;
        if (Math.abs(p.vy) > 2) {
          p.vy = -p.vy * (0.7 + Math.random() * 0.25);
          p.vx *= 0.98;
          p.bounces++;
        } else {
          p.vy = -Math.abs(p.vy) * 0.6;
        }
      }

      // 少し回転/スケール揺れを与える
      const lifeScale = 1 + Math.sin(age / 150) * 0.06;
      const scale = p.scale * lifeScale * (1 - t * 0.15);

      p.el.style.left = p.x + 'px';
      p.el.style.top = p.y + 'px';
      p.el.style.transform = `translate(-50%,-50%) scale(${scale})`;
      p.el.style.opacity = String(1 - t);
    }

    if (particles.length === 0) {
      // 終了処理
      cancelAnimationFrame(rafId);
      container.remove();
      return;
    }
    rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);

  // グローバルから呼べるようにする
  return {
    stop() {
      clearInterval(spawnTimer);
      cancelAnimationFrame(rafId);
      try { container.remove(); } catch(e){}
    }
  };
}

// グローバルでトリガできるよう公開
window.kenkaAnimation = kenkaAnimation;
