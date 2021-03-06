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
	$(GAME_JS_DIR)/api.js $(GAME_JS_DIR)/characters.js
GAME_JS_LICENSE = $(GAME_JS_DIR)/LICENSE.js
GAME_JS_TARGET = $(GAME_JS_DIR)/lpcd.js


.PHONY: help clean html sphinx virtualenv

html: $(GAME_JS_TARGET) minify sphinx

debug: $(GAME_JS_TARGET) sphinx

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  html       to make standalone HTML files"
	@echo "  debug      same as html, but without minification"
	@echo "  clean      to clean up the build environment"

clean:
	-rm -rf $(BUILDDIR)
	-rm $(GAME_JS_TARGET)

sphinx:
	$(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/"

virtualenv:
	virtualenv .
	./bin/easy_install sphinx docutils
	@echo
	@echo "Virtualenv installed.  You may now activate it with 'source bin/activate'"

$(GAME_JS_TARGET):
	@echo "Linking together the LPC javascript..."
	@echo
	cat $(GAME_JS_FILES) > $(GAME_JS_TARGET)

minify:
	@echo "Minifying the LPC javascript..."
	@echo
	yui-compressor $(GAME_JS_TARGET) -o $(GAME_JS_TARGET)-min --charset utf-8
	cat $(GAME_JS_LICENSE) $(GAME_JS_TARGET)-min > $(GAME_JS_TARGET)
