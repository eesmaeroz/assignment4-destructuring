#!/bin/sh
# Meryem Esma Eröz, 2200005798
# Builds latex/destructuring-guide.tex from ../README.md and compiles the PDF.
# Needs pandoc (3.x), a TeX Live with xelatex, latexmk and minted, and Pygments
# (minted calls pygmentize, so the build needs -shell-escape). Run from the latex/ folder:
#   sh build.sh
set -e
export LANG=C.UTF-8 LC_ALL=C.UTF-8

# The title page has the name and student number, so start the body at "Bonuses claimed".
python3 -c "
s = open('../README.md', encoding='utf-8').read()
open('guide-body.md', 'w', encoding='utf-8').write(s[s.index('Bonuses claimed:'):])
"

pandoc guide-body.md --metadata-file=metadata.yaml -f gfm+smart -t latex --standalone \
  --toc --toc-depth=2 --number-sections --shift-heading-level-by=-1 \
  --lua-filter widths.lua --lua-filter inline-code.lua --lua-filter code-blocks.lua \
  -H header.tex -o destructuring-guide.tex

# Name and student number at the top of the generated source too
printf '%% Meryem Esma Eröz, 2200005798\n%% Generated from ../README.md by build.sh\n' | cat - destructuring-guide.tex > tmp.tex && mv tmp.tex destructuring-guide.tex

latexmk -xelatex -shell-escape -interaction=nonstopmode -halt-on-error destructuring-guide.tex
