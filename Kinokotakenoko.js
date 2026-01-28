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
  setTimeout(() => {
    const result = ktlist.join('');
    originalText = result;
    display.innerText = result;
    display.classList.add('fade');
  }, 10);
}

function kt2() {
  const ktlist = ['き',"の","こ" ,"た","け","の","こ"];
  shuffle(ktlist);  
  const display = document.getElementById('display');
  display.classList.remove('fade');
  setTimeout(() => {
    const result = ktlist.join('');
    originalText = result;
    display.innerText = result;
    display.classList.add('fade');
  }, 10);
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
