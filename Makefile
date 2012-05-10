# Makefile for Sphinx documentation
#

# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
BUILDDIR      = build

# Internal variables.
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(SPHINXOPTS) source/docs/
# the i18n builder cannot share the environment and doctrees with the others
I18NSPHINXOPTS  = $(SPHINXOPTS) source/docs/

GAME_JS_FILES = lpcd/src/feature_shiv.js lpcd/src/header.js lpcd/src/map_loader.js \
	lpcd/src/controls.js lpcd/src/actor_model.js \
	lpcd/src/graphics.js lpcd/src/api.js
GAME_JS_TARGET = lpcd/lpcd.js


.PHONY: help clean html gamelink

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  html       to make standalone HTML files"
	@echo "  gamelink   link together the LPC javascript assets"

clean:
	-rm -rf $(BUILDDIR)/*

html:
	$(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/html."

gamelink:
	@echo "Linking together the LPC javascript..."
	@echo
	cat $(GAME_JS_FILES) > $(GAME_JS_TARGET)
