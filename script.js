    (function () {
      var THEME_KEY = "df-org-theme";
      var themeToggle = document.getElementById("themeToggle");
      function syncThemeButton() {
        if (!themeToggle) return;
        var t = document.documentElement.getAttribute("data-theme") || "dark";
        themeToggle.setAttribute("aria-label", t === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
        themeToggle.setAttribute("title", t === "dark" ? "Tema claro" : "Tema escuro");
      }
      function toggleTheme() {
        var next = (document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
        syncThemeButton();
      }
      if (themeToggle) {
        syncThemeButton();
        themeToggle.addEventListener("click", toggleTheme);
      }

      if (typeof gsap === "undefined") {
        console.error("GSAP não carregou");
        return;
      }

      var ORG_DATA = [
        { id: 0, name: "Jomar Jr", areas: [
          { id: "a0-0", name: "Estratégia", content: "Define prioridades, OKRs e o plano tático que orienta a operação e as entregas da empresa.", people: [
            { name: "Rita Mendes", role: "Plano tático e prioridades trimestrais" },
            { name: "Paulo Mota", role: "Indicadores e OKRs" },
          ]},
          { id: "a0-1", name: "Parcerias", content: "Estrutura e renovação da rede de fornecedores, com foco em qualidade e prazo.", people: [
            { name: "Lívia Costa", role: "Novos fornecedores nacionais" },
          ]},
        ]},
        { id: 1, name: "Claudio Romano", areas: [
          { id: "a1-0", name: "Financeiro", content: "Fechamento, fluxo de caixa, contas a pagar e a receber, alinhados à saúde financeira do negócio.", people: [
            { name: "Eduardo Vila", role: "Controladoria e fechamento" },
            { name: "Júlia Azevedo", role: "Contas a pagar e a receber" },
          ]},
          { id: "a1-1", name: "Fiscal", content: "Cumprimento de obrigações acessórias, retenções e conformidade com a legislação tributária.", people: [
            { name: "Marta Kehl", role: "Obrigações acessórias e retenções" },
          ]},
        ]},
        { id: 2, name: "Fabricio Ribeiro", areas: [
          { id: "a2-0", name: "Produção de evento", content: "Operação de piso, fornecedores, montagem e desmontagem com segurança e rigor de cronograma.", people: [
            { name: "Fábio T.", role: "Operação de piso e fornecedores" },
            { name: "Alê Prado", role: "Setup e desmontagem" },
          ]},
          { id: "a2-1", name: "Logística", content: "Roteirização, carga, descarga e suporte operacional à produção e ao cliente.", people: [
            { name: "Dani Cordeiro", role: "Roteirização e carga" },
          ]},
          { id: "a2-2", name: "Segurança", content: "EPI, normas de campo (NR) e briefings de segurança para equipes e parceiros.", people: [
            { name: "Gustavo Y.", role: "EPI, NR e briefing de campo" },
          ]},
        ]},
        { id: 3, name: "Bruno Guerra", areas: [
          { id: "a3-0", name: "Criativo", content: "Linha de arte, narrativa e conceito criativo 360° para eventos e campanhas da Dream.", people: [
            { name: "Iuri Santos", role: "Criação 360 e linha de arte" },
            { name: "Hanna Alves", role: "Cópia e narrativa" },
          ]},
          { id: "a3-1", name: "Mídias", content: "Planejamento, veiculação e otimização de mídias de performance e patrocinadas.", people: [
            { name: "Kiko Lima", role: "Mídias de performance" },
          ]},
        ]},
        { id: 4, name: "Fernanda Cozac", areas: [
          { id: "a4-0", name: "Relacionamento", content: "Pós-venda, experiência do cliente, pesquisas e melhoria contínua da jornada.", people: [
            { name: "Bia Duarte", role: "Pós-venda e satisfação" },
            { name: "Thi N.", role: "Pesquisa NPS" },
          ]},
          { id: "a4-1", name: "Prospecção", content: "Geração de oportunidades, contas estratégicas e evolução do pipeline comercial.", people: [
            { name: "Léo C.", role: "Contas e pipeline comercial" },
          ]},
        ]},
        { id: 5, name: "Cristine Oliveira", areas: [
          { id: "a5-0", name: "RH", content: "Atração, seleção, folha, benefícios e suporte a líderes em gestão de pessoas.", people: [
            { name: "Manu S.", role: "Recrutamento e seleção" },
            { name: "Orlando F.", role: "Folha e benefícios" },
          ]},
          { id: "a5-1", name: "Cultura", content: "Programas internos, trilha de aprendizagem e iniciativas que fortalecem o DNA da empresa.", people: [
            { name: "Pri Campos", role: "Pirralhos e trilha interna" },
          ]},
        ]},
        { id: 6, name: "Cristiano Coimbra", areas: [
          { id: "a6-0", name: "Jurídico", content: "Contratos, análise de risco, compliance e apoio jurídico às áreas e aos projetos.", people: [
            { name: "Dra. Helena Prado", role: "Contratos e compliance" },
          ]},
          { id: "a6-1", name: "Projetos", content: "Cronograma, alocação de recursos, escopos e governança da entrega de projetos.", people: [
            { name: "Mica R.", role: "Cronograma e alocação" },
            { name: "Cadu", role: "Documentação de escopos" },
          ]},
        ]},
      ];

      var president = document.getElementById("president");
      var hub = document.getElementById("hub");
      var hubStage = document.getElementById("hubStage");
      var areaStrip = document.getElementById("areaStrip");
      var appEl = document.querySelector(".app");
      var areaLayer = document.getElementById("areaLayer");
      /* Só diretores DENTRO do hub — o #probeDir fora do hub também é .ball--director e quebrava o índice 7 */
      var directors = [].slice.call((hubStage || hub).querySelectorAll(".ball--director"));
      function isMobileLayout() {
        return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 960px)").matches;
      }
      var lastMobileLayout = isMobileLayout();
      var hint = document.getElementById("hint");
      var panelEmpty = document.getElementById("panelEmpty");
      var panelContent = document.getElementById("panelContent");
      var expanded = false;
      var busy = false;
      var directorHoverSuppressed = false;
      var selectedDir = null;
      var activeAreaId = null;
      var n = 7;
      var areaBalls = [];
      /* Slots originais das áreas + tamanho do hub na altura do cálculo. Reescalados no resize para evitar “jitter”. */
      var areaSlotsBase = null;
      var hubSizeBase = null;
      /* Abertura = espelho do recolhimento: mesma duração, mesmo stagger, eases in/out pareados. */
      var AREA_TWEEN_DUR = 0.45;
      var AREA_STAGGER = 0.045;
      var G = 10;
      var probePres = document.getElementById("probePres");
      var probeDir = document.getElementById("probeDir");
      var probeArea = document.getElementById("probeArea");
      var lastPointerMoveMs = Date.now();
      function trackPointerActivity() { lastPointerMoveMs = Date.now(); }
      document.addEventListener("pointermove", trackPointerActivity, { passive: true, capture: true });
      document.addEventListener("mousemove", trackPointerActivity, { passive: true, capture: true });

      /** Hover só com rato: ignora “mouseenter” falso quando uma área deixa o diretor a descoberto sem o cursor se mover. */
      function directorHoverIsRealUserHover(e) {
        if (!e || e.isTrusted === false) return false;
        if (e.pointerType === "touch" || e.pointerType === "pen") return false;
        if ((Date.now() - lastPointerMoveMs) <= 100) return true;
        var rt = e.relatedTarget;
        if (rt && rt.closest && rt.closest(".ball--area")) return false;
        return true;
      }

      function dist(a, b) {
        var dx = a.x - b.x; var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
      }

      function measureDiameters() {
        var pW = (president && president.offsetWidth) || 0;
        var pH = (president && president.offsetHeight) || 0;
        var dW = 0;
        var dH = 0;
        for (var di = 0; di < directors.length; di++) {
          dW = Math.max(dW, directors[di].offsetWidth || 0);
          dH = Math.max(dH, directors[di].offsetHeight || 0);
        }
        if (probePres) { pW = Math.max(pW, probePres.offsetWidth); pH = Math.max(pH, probePres.offsetHeight); }
        if (probeDir) { dW = Math.max(dW, probeDir.offsetWidth); dH = Math.max(dH, probeDir.offsetHeight); }
        var aW = probeArea ? probeArea.offsetWidth : 0;
        var aH = probeArea ? probeArea.offsetHeight : 0;
        var w = hub.clientWidth || 400;
        if (!aW) aW = Math.min(96, Math.max(64, w * 0.15));
        if (!aH) aH = aW;
        if (!dW) dW = Math.min(110, Math.max(78, w * 0.2));
        if (!dH) dH = dW;
        if (!pW) pW = Math.min(160, Math.max(100, w * 0.25));
        if (!pH) pH = pW;
        return { president: Math.max(pW, pH), director: Math.max(dW, dH), area: Math.max(aW, aH) };
      }

      function getChartMaxBox() {
        var inner = document.querySelector(".app__inner");
        var maxW = inner ? Math.floor(inner.getBoundingClientRect().width) : 640;
        return { w: maxW, h: Math.min(window.innerHeight * 0.92, 1100) };
      }

      function ringRadiusNeed() {
        var D = measureDiameters();
        var sinH = Math.sin(Math.PI / n);
        var rPeer = (D.director + G) / (2 * sinH);
        var rPr = D.president / 2 + D.director / 2 + G;
        return Math.max(rPeer, rPr) * 1.05;
      }

      function applyHubMinForRing() {
        /* O anel ajusta o raio a esta caixa; não se altera minHeight/minWidth (evita salto do centro). */
      }

      function directorRingRadiusPx() {
        var need = ringRadiusNeed();
        var D = measureDiameters();
        var pad = 14;
        var capBox = getChartMaxBox();
        var stage = hubStage || hub;
        var w = stage ? Math.min(stage.clientWidth, capBox.w) : 0;
        var h = stage ? Math.min(stage.clientHeight, capBox.h) : 0;
        if (!w) w = hub && hub.clientWidth ? hub.clientWidth : 400;
        if (!h) h = hub && hub.clientHeight ? hub.clientHeight : 400;
        var capR = Math.min(w, h) / 2 - D.director / 2 - pad;
        return Math.min(need, Math.max(0, capR));
      }

      function positions() {
        var r = directorRingRadiusPx();
        var out = [];
        var RING_TURN = (2 * Math.PI / n) * 2.5;
        for (var i = 0; i < n; i++) {
          var angle = (i / n) * Math.PI * 2 - Math.PI / 2 + RING_TURN;
          out.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }
        return out;
      }

      /** Espaço mínimo (px) entre as bordas de duas bolas de área (não podem encostar). */
      var G_AREA_TO_AREA = 18;
      /** Espaço mínimo (px) entre a borda de uma área e a do presidente / de qualquer diretor. */
      var G_AREA_TO_DIRECTOR = 28;
      var PRES = { x: 0, y: 0 };

      function minCenterDistToDirector(D) {
        return D.area / 2 + D.director / 2 + G_AREA_TO_DIRECTOR + 2;
      }
      function minCenterDistToPresident(D) {
        return D.area / 2 + D.president / 2 + G_AREA_TO_DIRECTOR + 2;
      }

      function areaLayoutRandomOk(points, D, allDirectorPos) {
        var dA = D.area;
        var dDir = minCenterDistToDirector(D);
        var dPres = minCenterDistToPresident(D);
        for (var a = 0; a < points.length; a++) {
          var p = points[a];
          if (dist(p, PRES) < dPres) return false;
          for (var di = 0; di < allDirectorPos.length; di++) {
            if (dist(p, allDirectorPos[di]) < dDir) return false;
          }
          for (var b = a + 1; b < points.length; b++) {
            if (dist(p, points[b]) < dA + G_AREA_TO_AREA) return false;
          }
        }
        return true;
      }

      function nudgePlacedToValid(placed, D, allDirPos, halfX, halfY) {
        if (!placed.length) return placed;
        var copy = placed.map(function (pt) { return { x: pt.x, y: pt.y }; });
        for (var round = 0; round < 120; round++) {
          if (areaLayoutRandomOk(copy, D, allDirPos)) return copy;
          var j = round % copy.length;
          for (var t = 0; t < 35; t++) {
            var nx = (Math.random() * 2 - 1) * halfX;
            var ny = (Math.random() * 2 - 1) * halfY;
            var trial = copy.slice();
            trial[j] = { x: nx, y: ny };
            if (areaLayoutRandomOk(trial, D, allDirPos)) {
              copy = trial;
              break;
            }
          }
        }
        return copy;
      }

      /** Afasta projeção dos centros: presidente, todos os diretores e pares (área–área) até cumprir mínimos. */
      function relaxAreaLayout(placed, D, allDirPos, halfX, halfY) {
        if (!placed.length) return placed;
        var dA = D.area;
        var dDirT = minCenterDistToDirector(D);
        var dPresT = minCenterDistToPresident(D);
        var minPair = dA + G_AREA_TO_AREA;
        var out = placed.map(function (p) { return { x: p.x, y: p.y }; });
        for (var iter = 0; iter < 420; iter++) {
          for (var a = 0; a < out.length; a++) {
            var p = out[a];
            var d0p = dist(p, PRES);
            if (d0p < dPresT) {
              if (d0p < 1e-4) { p.x = dPresT; p.y = 0; }
              else { var s1 = dPresT / d0p; p.x *= s1; p.y *= s1; }
            }
            for (var di = 0; di < allDirPos.length; di++) {
              var c = allDirPos[di];
              var ddc = dist(p, c);
              if (ddc < dDirT) {
                if (ddc < 1e-4) { p.x = c.x + dDirT; p.y = c.y; }
                else { var t2 = dDirT / ddc; p.x = c.x + (p.x - c.x) * t2; p.y = c.y + (p.y - c.y) * t2; }
              }
            }
          }
          for (var a = 0; a < out.length; a++) {
            for (var b = a + 1; b < out.length; b++) {
              var p2 = out[a];
              var q = out[b];
              var ddc2 = dist(p2, q);
              if (ddc2 < minPair) {
                if (ddc2 < 1e-5) { p2.x += 3; p2.y += 0.5; }
                else {
                  var pushH = (minPair - ddc2) / 2;
                  var nxx = (p2.x - q.x) / ddc2;
                  var nyy = (p2.y - q.y) / ddc2;
                  p2.x += nxx * pushH; p2.y += nyy * pushH;
                  q.x -= nxx * pushH; q.y -= nyy * pushH;
                }
              }
            }
          }
          for (var a = 0; a < out.length; a++) {
            out[a].x = Math.max(-halfX, Math.min(halfX, out[a].x));
            out[a].y = Math.max(-halfY, Math.min(halfY, out[a].y));
          }
          if (areaLayoutRandomOk(out, D, allDirPos)) return out;
        }
        return out;
      }

      function computeRandomAreaPointsImpl(m, selDirIdx) {
        if (m <= 0) return [];
        if (selDirIdx === undefined || selDirIdx === null) selDirIdx = 0;
        var D = measureDiameters();
        var allDirPos = positions();
        var st = hubStage || hub;
        var w = (st && st.clientWidth) || 400;
        var h = (st && st.clientHeight) || 400;
        var rA = D.area / 2;
        var edgePad = rA + 6;
        var halfX = Math.max(80, w * 0.5 - edgePad);
        var halfY = Math.max(80, h * 0.5 - edgePad);
        var posActive = allDirPos[selDirIdx] || { x: 0, y: 1 };
        var awayAng = Math.atan2(-posActive.y, -posActive.x);
        var placed = [];
        var maxTries = m > 16 ? 4500 : m > 8 ? 2800 : 1500;
        for (var j = 0; j < m; j++) {
          var found = null;
          var baseAng = awayAng + (j / m) * (1.3 * Math.PI) + (Math.random() - 0.5) * 0.9 + Math.random() * 0.4;
          for (var t = 0; t < maxTries; t++) {
            var ang = baseAng + (Math.random() - 0.5) * 1.35;
            var rad = 0.38 + Math.random() * 0.62;
            if (t % 4 === 0) rad = 0.15 + Math.random() * 0.85;
            var rx = Math.cos(ang) * rad * halfX;
            var ry = Math.sin(ang) * rad * halfY;
            if (t % 6 === 0) {
              var ja = (Math.random() * 2) * Math.PI;
              var jr = 0.22 + Math.random() * 0.78;
              rx = Math.cos(ja) * jr * halfX;
              ry = Math.sin(ja) * jr * halfY;
            }
            var cand = { x: rx, y: ry };
            if (areaLayoutRandomOk(placed.concat([cand]), D, allDirPos)) {
              found = cand;
              break;
            }
          }
          if (found) {
            placed.push(found);
          } else {
            var cols = Math.ceil(Math.sqrt(m * 1.2));
            var rows = Math.ceil(m / cols);
            var r = Math.floor(j / cols);
            var c = j % cols;
            var oang = awayAng - 0.4 * Math.PI + ((c + 0.5) / cols) * 0.8 * Math.PI;
            var orad = 0.55 + (r + 0.5) / rows * 0.4;
            placed.push({
              x: Math.cos(oang) * orad * halfX + (Math.random() - 0.5) * 20,
              y: Math.sin(oang) * orad * halfY + (Math.random() - 0.5) * 20,
            });
          }
        }
        placed = nudgePlacedToValid(placed, D, allDirPos, halfX, halfY);
        placed = relaxAreaLayout(placed, D, allDirPos, halfX, halfY);
        if (placed.length && !areaLayoutRandomOk(placed, D, allDirPos)) {
          placed = [];
          var c2 = Math.ceil(Math.sqrt(m * 1.15));
          var r2 = Math.ceil(m / c2);
          for (var j2 = 0; j2 < m; j2++) {
            var rr = Math.floor(j2 / c2);
            var cc = j2 % c2;
            var fang = awayAng - 0.5 * Math.PI + ((cc + 0.5) / c2) * Math.PI;
            var fr = 0.4 + (rr + 0.5) / r2 * 0.55;
            placed.push({ x: Math.cos(fang) * fr * halfX, y: Math.sin(fang) * fr * halfY });
          }
          placed = nudgePlacedToValid(placed, D, allDirPos, halfX, halfY);
          placed = relaxAreaLayout(placed, D, allDirPos, halfX, halfY);
        }
        return placed;
      }

      function computeRandomAreaPoints(m, selDirIdx) {
        return computeRandomAreaPointsImpl(m, selDirIdx);
      }

      function findAreaMeta(areaId) {
        for (var d = 0; d < ORG_DATA.length; d++) {
          var dir = ORG_DATA[d];
          for (var a = 0; a < dir.areas.length; a++) {
            if (dir.areas[a].id === areaId) return { director: dir, area: dir.areas[a] };
          }
        }
        return null;
      }

      function unbindTeamAccordion() {
        if (panelContent && panelContent._accClick) {
          panelContent.removeEventListener("click", panelContent._accClick);
          panelContent._accClick = null;
        }
      }

      function bindTeamAccordion() {
        unbindTeamAccordion();
        if (!panelContent) return;
        var handler = function (e) {
          var btn = e.target.closest(".team-acc__trigger");
          if (!btn || !panelContent.contains(btn)) return;
          e.preventDefault();
          var item = btn.closest(".team-acc__item");
          if (!item) return;
          var open = item.classList.contains("is-open");
          var all = panelContent.querySelectorAll(".team-acc__item");
          for (var i = 0; i < all.length; i++) {
            all[i].classList.remove("is-open");
            var t = all[i].querySelector(".team-acc__trigger");
            if (t) t.setAttribute("aria-expanded", "false");
          }
          if (!open) {
            item.classList.add("is-open");
            btn.setAttribute("aria-expanded", "true");
          }
        };
        panelContent._accClick = handler;
        panelContent.addEventListener("click", handler);
      }

      function showPanel(fou) {
        if (!fou) return;
        var areaContent = (fou.area && fou.area.content) ? fou.area.content : "";
        var accBlocks = (fou.area.people || []).map(function (p, idx) {
          var isOpen = idx === 0;
          return (
            "<div class=\"team-acc__item" + (isOpen ? " is-open" : "") + "\">" +
              "<button type=\"button\" class=\"team-acc__trigger\" aria-expanded=\"" + (isOpen ? "true" : "false") + "\">" +
                "<span class=\"team-acc__name\">" + escapeHtml(p.name) + "</span>" +
                "<span class=\"team-acc__chev\" aria-hidden=\"true\"></span>" +
              "</button>" +
              "<div class=\"team-acc__panel\">" +
                "<div class=\"team-acc__inner\"><p class=\"team-acc__role\">" + escapeHtml(p.role) + "</p></div>" +
              "</div>" +
            "</div>"
          );
        }).join("");

        var html = (
          "<article class=\"overview overview--team\">" +
            "<p class=\"overview__meta\">Diretoria: <strong>" + escapeHtml(fou.director.name) + "</strong> · " +
            "Área: <strong>" + escapeHtml(fou.area.name) + "</strong></p>" +
            "<h3 class=\"overview__title\">" + escapeHtml(fou.area.name) + "</h3>" +
            (areaContent
              ? "<p class=\"overview__text\">" + escapeHtml(areaContent) + "</p>"
              : "") +
            "<p class=\"overview__eyebrow\">Equipe</p>" +
            "<div class=\"team-acc\">" + accBlocks + "</div>" +
          "</article>"
        );
        panelEmpty.style.display = "none";
        panelContent.style.display = "block";
        panelContent.removeAttribute("hidden");
        panelContent.innerHTML = html;
        bindTeamAccordion();
        if (appEl) appEl.classList.add("app--team-open");
        if (isMobileLayout()) document.body.classList.add("body--m-team");
        if (typeof gsap !== "undefined" && panelContent.querySelector) {
          var root = panelContent.querySelector(".overview--team");
          if (root) {
            gsap.fromTo(
              root.querySelectorAll(".overview__meta, .overview__title, .overview__text, .overview__eyebrow, .team-acc__item"),
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "back.out(1.2)", overwrite: "auto" }
            );
          }
        }
      }

      function clearPanel() {
        unbindTeamAccordion();
        activeAreaId = null;
        areaBalls.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        panelContent.innerHTML = "";
        panelContent.style.display = "none";
        panelContent.setAttribute("hidden", "");
        panelEmpty.style.display = "block";
        if (appEl) appEl.classList.remove("app--team-open");
        document.body.classList.remove("body--m-team");
      }

      function escapeHtml(s) {
        if (!s) return "";
        return String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      function setDirectorSelected(idx) {
        directors.forEach(function (el, i) {
          el.setAttribute("aria-pressed", idx >= 0 && i === idx ? "true" : "false");
        });
      }

      function destroyAreaBalls() {
        areaBalls.forEach(function (b) { b.remove(); });
        areaBalls = [];
        var stray = (hub || document).querySelectorAll(".ball--area");
        stray.forEach(function (b) { b.remove(); });
        if (areaStrip) {
          while (areaStrip.firstChild) areaStrip.removeChild(areaStrip.firstChild);
          areaStrip.setAttribute("hidden", "");
          areaStrip.setAttribute("aria-hidden", "true");
        }
        if (areaLayer) areaLayer.setAttribute("aria-hidden", "true");
        hub.classList.remove("has-areas");
        selectedDir = null;
        setDirectorSelected(-1);
        areaSlotsBase = null;
        hubSizeBase = null;
      }

      /** Anima as bolas de área de volta ao diretor (espelha a abertura, em ordem inversa). Retorna null se não houver o que recolher. */
      function buildAreaRetractTimeline() {
        if (!areaBalls.length || selectedDir === null) return null;
        if (isMobileLayout()) {
          var tlm = gsap.timeline();
          var n0 = areaBalls.length;
          areaBalls.forEach(function (el, j) {
            tlm.to(
              el,
              {
                y: 10,
                scale: 0.85,
                opacity: 0,
                duration: AREA_TWEEN_DUR * 0.92,
                ease: "power2.in",
                overwrite: "auto",
              },
              (n0 - 1 - j) * AREA_STAGGER
            );
          });
          return tlm;
        }
        var posD = positions()[selectedDir];
        if (!posD) return null;
        var n = areaBalls.length;
        var tl = gsap.timeline();
        areaBalls.forEach(function (el, j) {
          tl.to(
            el,
            {
              x: posD.x,
              y: posD.y,
              scale: 0,
              opacity: 0,
              duration: AREA_TWEEN_DUR,
              ease: "power2.in",
              overwrite: "auto",
            },
            (n - 1 - j) * AREA_STAGGER
          );
        });
        return tl;
      }

      function directorsPulseLeftToRight() {
        /* Evita que o crescimento da bola (scale) ative “mouseenter” de hover (scale 1.1) em todos. */
        directorHoverSuppressed = true;
        gsap.set(directors, { scale: 1 });
        var order = directors
          .map(function (el) {
            var r = el.getBoundingClientRect();
            return { el: el, x: r.left + r.width / 2 };
          })
          .sort(function (a, b) { return a.x - b.x; });
        var step = 0.08;
        var peak = 1.06;
        var up = 0.2;
        var down = 0.22;
        var tl = gsap.timeline({
          onComplete: function () {
            directorHoverSuppressed = false;
          },
        });
        order.forEach(function (item, idx) {
          var t0 = idx * step;
          tl.to(item.el, { scale: peak, transformOrigin: "50% 50%", duration: up, ease: "power2.out" }, t0);
          tl.to(item.el, { scale: 1, duration: down, ease: "power2.inOut" }, t0 + up);
        });
      }

      function placeAreaBalls(directorIndex) {
        if (!expanded) return;
        var data = ORG_DATA[directorIndex];
        if (!data) return;
        var m = data.areas.length;
        var mobile = isMobileLayout();
        var mount = (mobile && areaStrip) ? areaStrip : (hubStage || hub);
        destroyAreaBalls();
        hub.classList.add("has-areas");
        if (areaStrip) {
          if (mobile) {
            areaStrip.removeAttribute("hidden");
            areaStrip.setAttribute("aria-hidden", "false");
          } else {
            areaStrip.setAttribute("hidden", "");
            areaStrip.setAttribute("aria-hidden", "true");
          }
        }
        void hub.offsetWidth;
        directorsPulseLeftToRight();
        var posD = positions()[directorIndex];
        var slots = mobile ? null : computeRandomAreaPoints(m, directorIndex);
        if (!mobile && slots) {
          areaSlotsBase = slots.map(function (p) { return { x: p.x, y: p.y }; });
          hubSizeBase = { w: hub.clientWidth || 1, h: hub.clientHeight || 1 };
        } else {
          areaSlotsBase = null;
          hubSizeBase = null;
        }
        selectedDir = directorIndex;
        setDirectorSelected(directorIndex);
        data.areas.forEach(function (arObj, j) {
          var el = document.createElement("button");
          el.type = "button";
          el.className = "ball ball--area" + (mobile ? " hub__area-pill" : "");
          el.textContent = arObj.name;
          el.dataset.areaId = arObj.id;
          el.setAttribute("aria-pressed", activeAreaId === arObj.id ? "true" : "false");
          el.setAttribute("aria-label", "Área " + arObj.name);
          mount.appendChild(el);
          areaBalls.push(el);
        });

        if (mobile) {
          gsap.set(areaBalls, { y: 12, opacity: 0, scale: 0.98 });
          gsap.to(areaBalls, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.38,
            delay: 0,
            stagger: AREA_STAGGER,
            ease: "power2.out",
            onStart: function () {
              if (areaLayer) areaLayer.setAttribute("aria-hidden", "false");
            },
          });
        } else {
          /* Sai do diretor já visível e cresce de forma alinhada ao percurso até o tamanho final no slot. */
          var areaStartScale = 0.3;
          gsap.set(areaBalls, {
            x: posD.x,
            y: posD.y,
            xPercent: -50,
            yPercent: -50,
            left: "50%",
            top: "50%",
            transformOrigin: "50% 50%",
            scale: areaStartScale,
            opacity: 0.9,
            rotation: 0,
          });
          areaBalls.forEach(function (el, j) {
            if (!slots || !slots[j]) return;
            var tx = slots[j].x;
            var ty = slots[j].y;
            gsap.to(el, {
              x: tx,
              y: ty,
              scale: 1,
              opacity: 1,
              duration: AREA_TWEEN_DUR,
              delay: j * AREA_STAGGER,
              ease: "power2.out",
              rotation: 0,
              overwrite: "auto",
              onStart: function () {
                if (j === 0) areaLayer.setAttribute("aria-hidden", "false");
              },
            });
          });
        }

        areaBalls.forEach(function (el) {
          el.addEventListener("click", onAreaClick);
        });
      }

      function onAreaClick(e) {
        e.stopPropagation();
        if (busy) return;
        var id = e.currentTarget.dataset.areaId;
        if (!id) return;
        activeAreaId = id;
        areaBalls.forEach(function (b) {
          b.setAttribute("aria-pressed", b.dataset.areaId === id ? "true" : "false");
        });
        var info = findAreaMeta(id);
        showPanel(info);
        gsap.fromTo(
          e.currentTarget,
          { scale: 1, transformOrigin: "50% 50%" },
          { scale: 1.05, yoyo: true, repeat: 1, duration: 0.16, ease: "power2.inOut" }
        );
      }

      function onDirectorClick(e) {
        e.stopPropagation();
        if (busy || !expanded) {
          return;
        }
        var di = parseInt(e.currentTarget.getAttribute("data-index"), 10);
        if (selectedDir === di) {
          clearPanel();
          if (areaBalls.length) {
            if (busy) return;
            busy = true;
            var tlA = buildAreaRetractTimeline();
            if (tlA) {
              tlA.eventCallback("onComplete", function () {
                destroyAreaBalls();
                if (hint) hint.textContent = "";
                busy = false;
              });
              tlA.play(0);
            } else {
              destroyAreaBalls();
              if (hint) hint.textContent = "";
              busy = false;
            }
          } else {
            destroyAreaBalls();
            if (hint) hint.textContent = "";
          }
          return;
        }
        if (hint) hint.textContent = "";
        clearPanel();
        placeAreaBalls(di);
      }

      function bindDirectors() {
        directors.forEach(function (d) {
          d.addEventListener("click", onDirectorClick);
          d.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              d.click();
            }
          });
          d.addEventListener("mouseenter", function (e) {
            if (busy || directorHoverSuppressed) return;
            if (!directorHoverIsRealUserHover(e)) return;
            gsap.to(d, { scale: 1.1, duration: 0.22, ease: "power2.out", overwrite: "auto" });
          });
          d.addEventListener("mouseleave", function () {
            if (directorHoverSuppressed) return;
            gsap.to(d, { scale: 1, duration: 0.22, ease: "power2.out", overwrite: "auto" });
          });
        });
      }
      bindDirectors();

      gsap.set(directors, {
        x: 0, y: 0, xPercent: -50, yPercent: -50, left: "50%", top: "50%",
        scale: 0, opacity: 0, rotation: 0, transformOrigin: "50% 50%",
      });

      function animateDirectorsToCenter() {
        var collapseOnly = gsap.timeline({ onComplete: function () { busy = false; } });
        var order = [3, 1, 5, 0, 4, 2, 6];
        order.forEach(function (idx, seq) {
          var el = directors[idx];
          collapseOnly.to(
            el,
            { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0, duration: 0.6, ease: "power2.in" },
            seq * 0.04
          );
        });
        collapseOnly.to(president, { scale: 0.95, rotation: 6, duration: 0.16, ease: "sine.in", overwrite: "auto" }, 0.06);
        collapseOnly.to(president, { scale: 1, rotation: 0, duration: 0.38, ease: "sine.out" }, 0.2);
        collapseOnly.play(0);
      }

      function playCollapse() {
        clearPanel();
        var tlAreas = buildAreaRetractTimeline();
        if (tlAreas) {
          tlAreas.eventCallback("onComplete", function () {
            destroyAreaBalls();
            animateDirectorsToCenter();
          });
          tlAreas.play(0);
        } else {
          destroyAreaBalls();
          animateDirectorsToCenter();
        }
      }

      var expandOnce = function (posPre) {
        var pos = posPre;
        if (!pos || !pos.length) pos = positions();
        var moveEase = "power2.out";
        var tl = gsap.timeline({ onComplete: function () { busy = false; } });
        /* Pulso leve do presidente ao expandir o anel (tamanho normal do gráfico; “shrink” só ao escolher área no CSS) */
        tl.to(president, { scale: 1.04, rotation: 0, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.out" }, 0);
        tl.to(president, { scale: 1, duration: 0.35, ease: "power2.inOut" }, 0.3);
        directors.forEach(function (el, i) {
          var t = pos[i];
          var delay = 0.08 + i * 0.06;
          tl.to(
            el,
            {
              x: t.x, y: t.y, scale: 1, opacity: 1,
              rotation: 0,
              duration: 0.85, ease: moveEase,
            },
            delay
          );
        });
        return tl;
      };

      function handleResize() {
        if (expanded) {
          applyHubMinForRing();
          void hub.offsetWidth;
          var pos = positions();
          directors.forEach(function (el, i) {
            gsap.to(el, { x: pos[i].x, y: pos[i].y, rotation: 0, duration: 0.45, ease: "power2.out", overwrite: "auto" });
          });
        }
        var nowM = isMobileLayout();
        if (nowM !== lastMobileLayout) {
          lastMobileLayout = nowM;
          if (selectedDir !== null && expanded) {
            var dData = ORG_DATA[selectedDir];
            if (dData && dData.areas && dData.areas.length) {
              var prevA = activeAreaId;
              var prevFou = prevA ? findAreaMeta(prevA) : null;
              placeAreaBalls(selectedDir);
              if (prevFou) showPanel(prevFou);
            }
          }
        } else if (selectedDir !== null && areaBalls.length && areaSlotsBase && hubSizeBase) {
          if (isMobileLayout()) return;
          /* Em vez de sortear novas posições a cada resize (jitter), reescala as posições
             originais pelo rácio do hub atual e relaxa para garantir que cabem sem
             sobreposição. Resultado: a sanfona “puxa” o painel e as áreas acompanham
             suavemente, sem corte e sem saltos. */
          var st = hubStage || hub;
          var w = (st && st.clientWidth) || hubSizeBase.w;
          var h = (st && st.clientHeight) || hubSizeBase.h;
          var s = Math.min(w / hubSizeBase.w, h / hubSizeBase.h);
          var D2 = measureDiameters();
          var allDirPos2 = positions();
          var rA2 = D2.area / 2;
          var edgePad2 = rA2 + 6;
          var halfX2 = Math.max(80, w * 0.5 - edgePad2);
          var halfY2 = Math.max(80, h * 0.5 - edgePad2);
          var scaled = areaSlotsBase.map(function (p) { return { x: p.x * s, y: p.y * s }; });
          var relaxed = relaxAreaLayout(scaled, D2, allDirPos2, halfX2, halfY2);
          areaBalls.forEach(function (el, j) {
            if (!relaxed[j]) return;
            gsap.to(el, {
              x: relaxed[j].x,
              y: relaxed[j].y,
              rotation: 0,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        }
      }

      var resizeDebounce;
      window.addEventListener("resize", function () {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(handleResize, 80);
      });

      /**
       * Observa mudanças de tamanho do #hub (ex.: quando .app--team-open altera a grelha) e
       * pede ao JS para reposicionar diretores e áreas ao novo raio. Isto evita que as bolas
       * fiquem cortadas: a sanfona puxa o painel, o hub encolhe e o organograma acompanha.
       */
      if (typeof ResizeObserver !== "undefined" && hub) {
        var hubROScheduled = false;
        var hubRO = new ResizeObserver(function () {
          if (hubROScheduled) return;
          hubROScheduled = true;
          requestAnimationFrame(function () {
            hubROScheduled = false;
            if (expanded) handleResize();
          });
        });
        hubRO.observe(hub);
      }

      president.addEventListener("click", function () {
        if (busy) return;
        busy = true;
        if (!expanded) {
          expanded = true;
          president.setAttribute("aria-expanded", "true");
          president.setAttribute("aria-label", "Recolher diretores.");
          if (hint) hint.textContent = "";
          var chartEl = document.querySelector(".app__chart");
          applyHubMinForRing();
          hub.classList.add("is-expanded");
          void hub.offsetWidth;
          var ringPos = positions();
          if (chartEl) chartEl.scrollTop = 0;
          expandOnce(ringPos);
        } else {
          expanded = false;
          president.setAttribute("aria-expanded", "false");
          president.setAttribute("aria-label", "Expander ou recolher diretores. Estado: recolhido.");
          if (hint) hint.textContent = "";
          hub.classList.remove("is-expanded");
          hub.style.minHeight = "";
          hub.style.minWidth = "";
          playCollapse();
        }
      });
    })();
