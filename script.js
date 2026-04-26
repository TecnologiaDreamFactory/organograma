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
      var orgConnectors = document.getElementById("orgConnectors");
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
      var isExpanding = false;
      var isCollapsing = false;
      var isAreaAnimating = false;
      var areaAnimToken = 0;
      var directorHoverSuppressed = false;
      var selectedDir = null;
      var activeAreaId = null;
      var n = 7;
      var areaBalls = [];
      /* Abertura = espelho do recolhimento: mesma duração, mesmo stagger, eases in/out pareados. */
      var AREA_TWEEN_DUR = 0.45;
      var AREA_STAGGER = 0.045;
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
        if (!aW) aW = Math.min(140, Math.max(96, w * 0.18));
        if (!aH) aH = Math.min(56, Math.max(38, aW * 0.4));
        if (!dW) dW = Math.min(140, Math.max(96, w * 0.18));
        if (!dH) dH = Math.min(60, Math.max(40, dW * 0.4));
        if (!pW) pW = Math.min(160, Math.max(108, w * 0.2));
        if (!pH) pH = Math.min(72, Math.max(46, pW * 0.42));
        return {
          president: Math.max(pW, pH),
          director: Math.max(dW, dH),
          area: Math.max(aW, aH),
          presW: pW, presH: pH,
          dirW: dW, dirH: dH,
          areaW: aW, areaH: aH,
        };
      }

      function columnLayout() {
        var D = measureDiameters();
        var st = hubStage || hub;
        var w = (st && st.clientWidth) || 400;
        var h = (st && st.clientHeight) || 400;
        var mEdge = Math.max(16, Math.min(28, w * 0.025));
        var colGap = Math.max(36, Math.min(96, w * 0.085));
        var pW = D.presW;
        var dW = D.dirW;
        var dH = D.dirH;
        var aW = D.areaW;
        var presX = -w * 0.5 + mEdge + pW * 0.5;
        var presY = 0;
        var dirColX = presX + pW * 0.5 + colGap + dW * 0.5;
        var areaColX = dirColX + dW * 0.5 + colGap + aW * 0.5;
        var nDir = n;
        var vGap = Math.max(18, dH * 0.55);
        var step = dH + vGap;
        if (nDir > 1) {
          var minStep = dH + 6;
          var maxH = h - 2 * mEdge;
          var need = (nDir - 1) * step + dH;
          if (need > maxH) {
            var stepMin = (maxH - dH) / (nDir - 1);
            step = Math.max(minStep, stepMin);
          }
        } else {
          step = 0;
        }
        var dirs = [];
        for (var i = 0; i < nDir; i++) {
          var yi = (i - (nDir - 1) * 0.5) * step;
          dirs.push({ x: dirColX, y: yi });
        }
        return {
          pres: { x: presX, y: presY },
          dirs: dirs,
          areaColX: areaColX,
          w: w,
          h: h,
          mEdge: mEdge,
          D: D,
          step: step,
        };
      }

      function applyHubMinForRing() {
        /* compat: anel legado; layout em coluna não fixa minWidth no JS */
      }

      function positions() {
        return columnLayout().dirs;
      }

      function computeColumnAreaPoints(m, directorIndex) {
        if (m <= 0) return [];
        var L = columnLayout();
        var y0 = (L.dirs[directorIndex] && L.dirs[directorIndex].y) || 0;
        var x = L.areaColX;
        var aH = L.D.areaH;
        var agap = Math.max(14, aH * 0.36);
        var mE = L.mEdge;
        var h2 = L.h * 0.5;
        var ymin = -h2 + mE + aH * 0.5;
        var ymax = h2 - mE - aH * 0.5;
        var step2 = aH + agap;
        if (m > 1) {
          /* Só comprime se não couber no hub (caso muito raro com 3+ áreas). */
          var totalAvail = ymax - ymin;
          var totalNeeded = (m - 1) * step2 + aH;
          if (totalNeeded > totalAvail) {
            step2 = Math.max(aH + 6, (totalAvail - aH) / (m - 1));
          }
        }
        var out = [];
        for (var j = 0; j < m; j++) {
          var yj = y0 + (j - (m - 1) * 0.5) * step2;
          yj = Math.max(ymin, Math.min(ymax, yj));
          out.push({ x: x, y: yj });
        }
        /* Após o clamp pelas bordas do hub, força o espaçamento mínimo entre
           áreas adjacentes. Sem isso, no topo (1.º diretor) e no fundo (último),
           várias áreas eram "empurradas" para a mesma linha e sobrepunham-se. */
        for (var k = 1; k < out.length; k++) {
          var lo = out[k - 1].y + step2;
          if (out[k].y < lo) out[k].y = Math.min(ymax, lo);
        }
        for (var k2 = out.length - 2; k2 >= 0; k2--) {
          var hi = out[k2 + 1].y - step2;
          if (out[k2].y > hi) out[k2].y = Math.max(ymin, hi);
        }
        return out;
      }

      function lineColorForConnectors() {
        return document.documentElement.getAttribute("data-theme") === "light"
          ? "rgba(100, 95, 88, 0.42)"
          : "rgba(150, 145, 135, 0.5)";
      }

      function buildCurveD(x1, y1, x2, y2) {
        var dx = Math.max(24, Math.abs(x2 - x1) * 0.55);
        return (
          "M" + x1 + "," + y1 +
          " C" + (x1 + dx) + "," + y1 + " " + (x2 - dx) + "," + y2 + " " + x2 + "," + y2
        );
      }

      function ensureConnectorsViewBox() {
        if (!orgConnectors || !hubStage) return false;
        var w = hubStage.clientWidth;
        var h = hubStage.clientHeight;
        if (w < 1 || h < 1) return false;
        orgConnectors.setAttribute("viewBox", "0 0 " + w + " " + h);
        orgConnectors.setAttribute("width", String(w));
        orgConnectors.setAttribute("height", String(h));
        return true;
      }

      /** Pontos de saída do presidente / entrada de cada diretor, em coords do palco. */
      function presOutputPoint(L) {
        return { x: L.w / 2 + L.pres.x + L.D.presW / 2, y: L.h / 2 + L.pres.y };
      }
      function dirInputPoint(L, i) {
        var dp = L.dirs[i];
        return { x: L.w / 2 + dp.x - L.D.dirW / 2, y: L.h / 2 + dp.y };
      }

      /**
       * Desenha as linhas presidente→diretores e revela cada diretor à medida que a
       * sua linha se completa (mascarando com stroke-dasharray).
       */
      function animateConnectorsAndDirectors() {
        if (!ensureConnectorsViewBox()) return null;
        var ns = "http://www.w3.org/2000/svg";
        orgConnectors.innerHTML = "";
        var L = columnLayout();
        var stroke = lineColorForConnectors();
        var pOut = presOutputPoint(L);
        var lineDur = 0.55;
        var stagger = 0.07;
        var tl = gsap.timeline();
        for (var i = 0; i < directors.length; i++) {
          var pIn = dirInputPoint(L, i);
          var d = buildCurveD(pOut.x, pOut.y, pIn.x, pIn.y);
          var path = document.createElementNS(ns, "path");
          path.setAttribute("d", d);
          path.setAttribute("stroke", stroke);
          path.setAttribute("stroke-width", "1");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("data-kind", "pres-dir");
          orgConnectors.appendChild(path);
          var len = 0;
          try { len = path.getTotalLength(); } catch (e) { len = 0; }
          if (!len || !isFinite(len)) len = Math.hypot(pIn.x - pOut.x, pIn.y - pOut.y);
          path.style.strokeDasharray = String(len);
          path.style.strokeDashoffset = String(len);
          var t0 = i * stagger;
          tl.fromTo(
            path,
            { strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: lineDur,
              ease: "power2.inOut",
              overwrite: "auto",
              immediateRender: false,
            },
            t0
          );
          var dirEl = directors[i];
          var dp = L.dirs[i];
          tl.fromTo(
            dirEl,
            { x: pIn.x - L.w / 2, y: pIn.y - L.h / 2, scale: 0.45, opacity: 0 },
            {
              x: dp.x,
              y: dp.y,
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: "back.out(1.4)",
              overwrite: "auto",
              immediateRender: false,
            },
            t0 + lineDur * 0.7
          );
        }
        return tl;
      }

      function scheduleOrgConnectors() {
        if (typeof requestAnimationFrame === "function") {
          requestAnimationFrame(function () {
            requestAnimationFrame(updateOrgConnectors);
          });
        } else {
          setTimeout(updateOrgConnectors, 0);
        }
      }

      function updateOrgConnectors() {
        if (!orgConnectors || !hubStage) return;
        if (isExpanding || isCollapsing || isAreaAnimating) return;
        var ns = "http://www.w3.org/2000/svg";
        orgConnectors.innerHTML = "";
        if (!expanded) return;
        var w = hubStage.clientWidth;
        var h = hubStage.clientHeight;
        if (w < 1 || h < 1) return;
        orgConnectors.setAttribute("viewBox", "0 0 " + w + " " + h);
        orgConnectors.setAttribute("width", String(w));
        orgConnectors.setAttribute("height", String(h));
        var hbr = hubStage.getBoundingClientRect();
        function rectOf(el) {
          if (!el) return null;
          var r = el.getBoundingClientRect();
          return {
            left: r.left - hbr.left,
            right: r.right - hbr.left,
            top: r.top - hbr.top,
            bottom: r.bottom - hbr.top,
            cy: r.top - hbr.top + r.height / 2,
            cx: r.left - hbr.left + r.width / 2,
          };
        }
        var stroke = lineColorForConnectors();
        function appendCurve(x1, y1, x2, y2, kind) {
          var d = buildCurveD(x1, y1, x2, y2);
          var p = document.createElementNS(ns, "path");
          p.setAttribute("d", d);
          p.setAttribute("stroke", stroke);
          p.setAttribute("stroke-width", "1");
          p.setAttribute("fill", "none");
          p.setAttribute("stroke-linecap", "round");
          if (kind) p.setAttribute("data-kind", kind);
          orgConnectors.appendChild(p);
          try {
            var len = p.getTotalLength();
            if (len && isFinite(len)) {
              p.style.strokeDasharray = String(len);
              p.style.strokeDashoffset = "0";
            }
          } catch (e) {}
        }
        var pr = rectOf(president);
        if (!pr) return;
        var pOut = { x: pr.right, y: pr.cy };
        for (var i = 0; i < directors.length; i++) {
          var dr = rectOf(directors[i]);
          if (!dr) continue;
          appendCurve(pOut.x, pOut.y, dr.left, dr.cy, "pres-dir");
        }
        if (!isMobileLayout() && areaBalls && areaBalls.length && selectedDir !== null) {
          var drc = rectOf(directors[selectedDir]);
          if (drc) {
            for (var j = 0; j < areaBalls.length; j++) {
              var ar = rectOf(areaBalls[j]);
              if (!ar) continue;
              appendCurve(drc.right, drc.cy, ar.left, ar.cy, "dir-area");
            }
          }
        }
      }

      /**
       * Desenha as linhas diretor→área (máscara stroke-dashoffset) e revela cada bola
       * de área ao final do percurso. Retorna um GSAP timeline. Só é usada em desktop.
       */
      function animateConnectorsAndAreas(directorIndex, slots) {
        if (!ensureConnectorsViewBox()) return null;
        if (!areaBalls || !areaBalls.length || !slots) return null;
        var ns = "http://www.w3.org/2000/svg";
        if (orgConnectors) {
          var oldAreaPaths = orgConnectors.querySelectorAll('[data-kind="dir-area"]');
          for (var k = 0; k < oldAreaPaths.length; k++) oldAreaPaths[k].remove();
        }
        var L = columnLayout();
        var dp = L.dirs[directorIndex];
        if (!dp) return null;
        var stroke = lineColorForConnectors();
        var pOut = { x: L.w / 2 + dp.x + L.D.dirW / 2, y: L.h / 2 + dp.y };
        var lineDur = 0.5;
        var stagger = 0.06;
        var tl = gsap.timeline();
        for (var i = 0; i < areaBalls.length; i++) {
          var slot = slots[i];
          if (!slot) continue;
          var pIn = { x: L.w / 2 + slot.x - L.D.areaW / 2, y: L.h / 2 + slot.y };
          var d = buildCurveD(pOut.x, pOut.y, pIn.x, pIn.y);
          var path = document.createElementNS(ns, "path");
          path.setAttribute("d", d);
          path.setAttribute("stroke", stroke);
          path.setAttribute("stroke-width", "1");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("data-kind", "dir-area");
          orgConnectors.appendChild(path);
          var len = 0;
          try { len = path.getTotalLength(); } catch (e) { len = 0; }
          if (!len || !isFinite(len)) len = Math.hypot(pIn.x - pOut.x, pIn.y - pOut.y);
          path.style.strokeDasharray = String(len);
          path.style.strokeDashoffset = String(len);
          var t0 = i * stagger;
          tl.fromTo(
            path,
            { strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: lineDur,
              ease: "power2.inOut",
              overwrite: "auto",
              immediateRender: false,
            },
            t0
          );
          var areaEl = areaBalls[i];
          tl.fromTo(
            areaEl,
            { x: pIn.x - L.w / 2, y: pIn.y - L.h / 2, scale: 0.45, opacity: 0 },
            {
              x: slot.x,
              y: slot.y,
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: "back.out(1.4)",
              overwrite: "auto",
              immediateRender: false,
            },
            t0 + lineDur * 0.7
          );
        }
        return tl;
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
        scheduleOrgConnectors();
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
        var dirAreaPaths = orgConnectors
          ? [].slice.call(orgConnectors.querySelectorAll('[data-kind="dir-area"]'))
          : [];
        areaBalls.forEach(function (el, j) {
          var t0 = (n - 1 - j) * AREA_STAGGER;
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
            t0
          );
          var path = dirAreaPaths[j];
          if (path) {
            var len = 0;
            try { len = path.getTotalLength(); } catch (e) { len = 0; }
            if (!len || !isFinite(len)) len = 200;
            if (!path.style.strokeDasharray) {
              path.style.strokeDasharray = String(len);
              path.style.strokeDashoffset = "0";
            }
            tl.to(
              path,
              {
                strokeDashoffset: len,
                duration: AREA_TWEEN_DUR,
                ease: "power2.in",
                overwrite: "auto",
              },
              t0
            );
          }
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
            return { el: el, y: r.top + r.height / 2 };
          })
          .sort(function (a, b) { return a.y - b.y; });
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
        var slots = mobile ? null : computeColumnAreaPoints(m, directorIndex);
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
          /* Desktop: linhas surgem com máscara (stroke-dashoffset) saindo do diretor
             e a bola da área aparece ao final do percurso. */
          gsap.set(areaBalls, {
            x: posD.x,
            y: posD.y,
            xPercent: -50,
            yPercent: -50,
            left: "50%",
            top: "50%",
            transformOrigin: "50% 50%",
            scale: 0.3,
            opacity: 0,
            rotation: 0,
          });
          if (areaLayer) areaLayer.setAttribute("aria-hidden", "false");
          isAreaAnimating = true;
          var tok = ++areaAnimToken;
          var tlAreaIn = animateConnectorsAndAreas(directorIndex, slots);
          if (tlAreaIn) {
            tlAreaIn.eventCallback("onComplete", function () {
              if (tok === areaAnimToken) isAreaAnimating = false;
            });
          } else {
            isAreaAnimating = false;
            areaBalls.forEach(function (el, j) {
              if (!slots || !slots[j]) return;
              gsap.to(el, {
                x: slots[j].x,
                y: slots[j].y,
                scale: 1,
                opacity: 1,
                duration: AREA_TWEEN_DUR,
                delay: j * AREA_STAGGER,
                ease: "power2.out",
                overwrite: "auto",
              });
            });
          }
        }

        areaBalls.forEach(function (el) {
          el.addEventListener("click", onAreaClick);
        });
        if (mobile) setTimeout(scheduleOrgConnectors, 420);
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
            isAreaAnimating = true;
            areaAnimToken++;
            var tlA = buildAreaRetractTimeline();
            if (tlA) {
              tlA.eventCallback("onComplete", function () {
                isAreaAnimating = false;
                destroyAreaBalls();
                if (hint) hint.textContent = "";
                busy = false;
              });
              tlA.play(0);
            } else {
              isAreaAnimating = false;
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

      if (president) {
        gsap.set(president, {
          x: 0, y: 0, xPercent: -50, yPercent: -50, left: "50%", top: "50%",
          scale: 1, opacity: 1, rotation: 0, transformOrigin: "50% 50%",
        });
      }

      /**
       * Espelha a expansão: as linhas retraem-se (dashoffset 0 → len) enquanto cada
       * diretor encolhe na direção do presidente, em ordem inversa (de baixo para cima).
       */
      function animateRetractToPresident() {
        if (!orgConnectors) return null;
        var L = columnLayout();
        var pOut = presOutputPoint(L);
        var paths = [].slice.call(orgConnectors.querySelectorAll('[data-kind="pres-dir"]'));
        var tl = gsap.timeline();
        var lineDur = 0.5;
        var stagger = 0.06;
        var nDir = directors.length;
        for (var k = 0; k < nDir; k++) {
          var i = nDir - 1 - k;
          var t0 = k * stagger;
          var dirEl = directors[i];
          var path = paths[i];
          if (path) {
            var len = 0;
            try { len = path.getTotalLength(); } catch (e) { len = 0; }
            if (!len || !isFinite(len) || len < 1) {
              var dp0 = L.dirs[i];
              var pIn0 = { x: L.w / 2 + dp0.x - L.D.dirW / 2, y: L.h / 2 + dp0.y };
              len = Math.hypot(pIn0.x - pOut.x, pIn0.y - pOut.y);
            }
            if (!path.style.strokeDasharray) {
              path.style.strokeDasharray = String(len);
              path.style.strokeDashoffset = "0";
            }
            tl.to(
              path,
              { strokeDashoffset: len, duration: lineDur, ease: "power2.inOut", overwrite: "auto" },
              t0
            );
          }
          tl.to(
            dirEl,
            {
              x: pOut.x - L.w / 2,
              y: pOut.y - L.h / 2,
              scale: 0,
              opacity: 0,
              duration: lineDur * 0.85,
              ease: "power2.in",
              overwrite: "auto",
            },
            t0 + lineDur * 0.1
          );
        }
        return tl;
      }

      /** Cleanup das áreas (sem mexer nas linhas presidente↔diretor). */
      function destroyAreaBallsKeepPresLines() {
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
        if (orgConnectors) {
          var areaPaths = orgConnectors.querySelectorAll('[data-kind="dir-area"]');
          for (var k = 0; k < areaPaths.length; k++) areaPaths[k].remove();
        }
      }

      function runDirectorRetractAndPresidentReturn() {
        var tlR = animateRetractToPresident();
        var main = gsap.timeline({
          onComplete: function () {
            if (orgConnectors) orgConnectors.innerHTML = "";
            gsap.set(directors, { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0 });
            isCollapsing = false;
            busy = false;
          },
        });
        if (tlR) {
          main.add(tlR, 0);
          main.to(
            president,
            { x: 0, y: 0, scale: 0.92, rotation: 0, duration: 0.45, ease: "power3.inOut", overwrite: "auto" },
            ">-=0.05"
          );
          main.to(
            president,
            { scale: 1, duration: 0.3, ease: "back.out(1.6)" },
            ">-=0.02"
          );
        } else {
          gsap.set(directors, { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0 });
          main.to(
            president,
            { x: 0, y: 0, scale: 0.92, rotation: 0, duration: 0.45, ease: "power3.inOut", overwrite: "auto" },
            0
          );
          main.to(president, { scale: 1, duration: 0.3, ease: "back.out(1.6)" }, ">-=0.02");
        }
      }

      function playCollapse() {
        clearPanel();
        isCollapsing = true;
        var tlAreas = buildAreaRetractTimeline();
        var continueRetract = function () {
          destroyAreaBallsKeepPresLines();
          runDirectorRetractAndPresidentReturn();
        };
        if (tlAreas) {
          tlAreas.eventCallback("onComplete", continueRetract);
          tlAreas.play(0);
        } else {
          continueRetract();
        }
      }

      var expandOnce = function (posPre) {
        var pos = posPre;
        if (!pos || !pos.length) pos = positions();
        var L = columnLayout();
        if (orgConnectors) orgConnectors.innerHTML = "";
        gsap.set(directors, { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0 });
        isExpanding = true;
        var tl = gsap.timeline({
          onComplete: function () { isExpanding = false; busy = false; },
        });
        tl.set(
          president,
          { xPercent: -50, yPercent: -50, left: "50%", top: "50%", transformOrigin: "50% 50%" },
          0
        );
        var presMoveDur = 0.6;
        tl.to(
          president,
          { x: L.pres.x, y: L.pres.y, scale: 1.04, rotation: 0, duration: presMoveDur, ease: "power3.out" },
          0
        );
        tl.to(
          president,
          { scale: 1, duration: 0.25, ease: "power2.inOut" },
          presMoveDur
        );
        var subTl = animateConnectorsAndDirectors();
        if (subTl) tl.add(subTl, presMoveDur + 0.08);
        return tl;
      };

      function handleResize() {
        if (isExpanding || isCollapsing || isAreaAnimating) return;
        if (expanded) {
          applyHubMinForRing();
          void hub.offsetWidth;
          var Lh = columnLayout();
          if (president) {
            gsap.set(president, { x: Lh.pres.x, y: Lh.pres.y, overwrite: "auto" });
          }
          var pos = positions();
          directors.forEach(function (el, i) {
            gsap.to(el, { x: pos[i].x, y: pos[i].y, rotation: 0, duration: 0.45, ease: "power2.out", overwrite: "auto" });
          });
          scheduleOrgConnectors();
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
        } else if (selectedDir !== null && areaBalls.length) {
          if (isMobileLayout()) return;
          var m = areaBalls.length;
          var slots3 = computeColumnAreaPoints(m, selectedDir);
          areaBalls.forEach(function (el, j) {
            if (!slots3[j]) return;
            gsap.to(el, {
              x: slots3[j].x,
              y: slots3[j].y,
              rotation: 0,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
          scheduleOrgConnectors();
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
