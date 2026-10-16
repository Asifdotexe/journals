/**
 * Code block copy button and language badge enhancement
 * Extracts clean code text without language badges or UI labels
 */
document.addEventListener('DOMContentLoaded', function () {
  var preElements = document.querySelectorAll('.post-content pre, .post pre, pre');

  preElements.forEach(function (pre) {
    // Avoid double wrapping
    if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) {
      return;
    }

    var code = pre.querySelector('code');
    var textToCopySource = code || pre;

    // Detect language class (e.g. language-powershell, language-bash, language-markdown)
    var lang = '';
    var classes = (pre.className + ' ' + (code ? code.className : '')).split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      var cls = classes[i].trim();
      if (cls.indexOf('language-') === 0) {
        lang = cls.replace('language-', '').trim();
        break;
      }
    }

    // Create wrapper container
    var wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    if (pre.classList.contains('terminal')) {
      wrapper.classList.add('dark');
    }

    // Insert wrapper before pre and move pre inside it
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Add language label badge if a recognized language is present
    if (lang && lang !== 'text' && lang !== 'none') {
      var badge = document.createElement('span');
      badge.className = 'code-lang-badge';
      badge.textContent = lang;
      wrapper.appendChild(badge);
    }

    // Create copy button
    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.innerHTML =
      '<svg class="copy-icon" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
        '<path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>' +
        '<path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>' +
      '</svg>' +
      '<svg class="check-icon" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
        '<path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>' +
      '</svg>' +
      '<span class="copy-text">Copy</span>';

    wrapper.appendChild(button);

    // Copy action
    button.addEventListener('click', function () {
      var text = textToCopySource.textContent.replace(/\r\n/g, '\n');

      function showCopied() {
        button.classList.add('copied');
        var textSpan = button.querySelector('.copy-text');
        if (textSpan) textSpan.textContent = 'Copied!';
        setTimeout(function () {
          button.classList.remove('copied');
          if (textSpan) textSpan.textContent = 'Copy';
        }, 2000);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(showCopied).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }

      function fallbackCopy(str) {
        var textArea = document.createElement('textarea');
        textArea.value = str;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          var successful = document.execCommand('copy');
          if (successful) showCopied();
        } catch (e) {
          console.error('Fallback copy failed', e);
        }
        document.body.removeChild(textArea);
      }
    });
  });
});
