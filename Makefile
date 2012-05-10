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

GAME_JS_DIR = source/static/demogame/js

GAME_JS_FILES = $(GAME_JS_DIR)/feature_shiv.js $(GAME_JS_DIR)/header.js \
	$(GAME_JS_DIR)/map_loader.js $(GAME_JS_DIR)/controls.js \
	$(GAME_JS_DIR)/actor_model.js $(GAME_JS_DIR)/graphics.js \
	$(GAME_JS_DIR)/api.js
GAME_JS_TARGET = $(GAME_JS_DIR)/lpcd.js


.PHONY: help clean html gamelink

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  html       to make standalone HTML files"

clean:
	-rm $(GAME_JS_TARGET)
	-rm -rf $(BUILDDIR)/*

html: $(GAME_JS_TARGET)
	$(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/html."

$(GAME_JS_TARGET):
	@echo "Linking together the LPC javascript..."
	@echo
	cat $(GAME_JS_FILES) > $(GAME_JS_TARGET)
