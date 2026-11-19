import './style.css'

const regions = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄']

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="game-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="市町村当てゲーム ホーム">
        <span class="brand-mark" aria-hidden="true">〒</span>
        <span>市町村当てゲーム</span>
      </a>
    </header>

    <main class="game-layout">
      <aside class="filter-panel" aria-label="出題範囲">
        <div class="panel-heading">
          <div>
            <h2>出題範囲</h2>
          </div>
        </div>
        <p class="panel-description">出題する地方を選んでください</p>
        <fieldset class="region-list">
          <legend class="visually-hidden">出題する地方</legend>
          ${regions.map((region) => `
            <label class="region-option">
              <input type="checkbox" name="region" value="${region}" checked>
              <span class="checkmark" aria-hidden="true"></span>
              <span>${region}</span>
            </label>
          `).join('')}
        </fieldset>
        <div class="region-actions">
          <button class="text-button" type="button">すべて選択</button>
          <button class="text-button text-button-clear" type="button">すべて解除</button>
        </div>
      </aside>

      <section class="play-area" aria-label="ゲーム">
        <section class="question-card" aria-labelledby="question-title">
          <h1 id="question-title">西目屋村</h1>
          <div class="question-extra" aria-live="polite">
            <button class="hint-button" type="button">郡名を表示</button>
          </div>
        </section>

        <section class="map-card" aria-label="地図">
          <div class="map-placeholder" role="img" aria-label="日本地図の表示領域">
            <div class="map-watermark" aria-hidden="true">JAPAN</div>
            <div class="map-message">
              <span class="map-pin-icon" aria-hidden="true">⌖</span>
              <p>地図を準備しています</p>
              <span>地図上をクリックしてピンを置く</span>
            </div>
            <div class="map-controls" aria-label="地図の拡大縮小">
              <button type="button" aria-label="拡大">＋</button>
              <button type="button" aria-label="縮小">−</button>
            </div>
            <span class="map-credit">白地図エリア</span>
          </div>
        </section>

        <section class="result-banner" aria-live="polite" aria-label="結果">
          <span class="result-symbol" aria-hidden="true">?</span>
          <div><strong>結果</strong></div>
        </section>

        <footer class="action-bar">
          <div class="action-buttons">
            <button class="button button-secondary" type="button">答えを見る</button>
            <button class="button button-primary" type="button" disabled>回答を確定</button>
            <button class="button button-next" type="button" hidden>次の問題へ <span aria-hidden="true">→</span></button>
          </div>
        </footer>
      </section>
    </main>
    <details class="mobile-filter">
      <summary><span aria-hidden="true">☷</span> 出題範囲を選ぶ</summary>
      <div class="mobile-filter-content"><p>出題範囲の選択は左側のパネルと共通です。</p></div>
    </details>
  </div>
`
