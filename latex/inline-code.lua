-- Meryem Esma Eröz, 2200005798
-- Inline `code` -> \texttt{...} with break points after / < > ] and dots, and before quotes
-- (code blocks become minted environments, see code-blocks.lua)
function Code(el)
  local tex = pandoc.write(pandoc.Pandoc({pandoc.Plain({pandoc.Code(el.text)})}), 'latex')
  tex = tex:gsub('%s+$', '')
  tex = tex:gsub('/', '/\\allowbreak{}')
  tex = tex:gsub('\\textgreater{}', '\\textgreater{}\\allowbreak{}')
  tex = tex:gsub('\\textless{}', '\\textless{}\\allowbreak{}')
  tex = tex:gsub('%]', ']\\allowbreak{}')
  tex = tex:gsub('\\textquotesingle{}', '\\allowbreak{}\\textquotesingle{}')
  tex = tex:gsub('%.', '.\\allowbreak{}')
  return pandoc.RawInline('latex', tex)
end
