-- Meryem Esma Eröz, 2200005798
-- Table column widths: proportional to the longest cell text, but never narrower
-- than the longest single word in the column (about 60-85 monospace chars per line).
function Table(tbl)
  local n = #tbl.colspecs
  local maxlen, maxword = {}, {}
  for i = 1, n do maxlen[i] = 4; maxword[i] = 4 end
  local function scan(rows)
    for _, row in ipairs(rows) do
      for i, cell in ipairs(row.cells) do
        local text = pandoc.utils.stringify(cell.contents)
        maxlen[i] = math.max(maxlen[i], math.min(#text, 120))
        for w in text:gmatch('%S+') do maxword[i] = math.max(maxword[i], math.min(#w, 24)) end
      end
    end
  end
  scan(tbl.head.rows)
  for _, body in ipairs(tbl.bodies) do scan(body.body) end
  local total = 0
  for i = 1, n do total = total + maxlen[i] end
  local widths, sum = {}, 0
  for i = 1, n do
    widths[i] = math.max(maxlen[i] / total, maxword[i] / 60, 0.12)
    sum = sum + widths[i]
  end
  for i = 1, n do tbl.colspecs[i] = {tbl.colspecs[i][1], widths[i] / sum * 0.97} end
  return tbl
end
