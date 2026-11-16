-- Meryem Esma Eröz, 2200005798
-- Code blocks -> minted environments (Pygments syntax highlighting).
-- Blocks without a language (program output, terminal commands) are plain text.
local lexers = { js = 'js', jsx = 'jsx', ts = 'ts', tsx = 'tsx', markdown = 'md' }

function CodeBlock(el)
  local lang = lexers[el.classes[1] or ''] or 'text'
  return pandoc.RawBlock('latex',
    '\\begin{minted}{' .. lang .. '}\n' .. el.text .. '\n\\end{minted}')
end
