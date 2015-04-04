SRC = $(shell find src)
DIST = $(SRC:src/%.js=dist/%.js);

dist: $(DIST)
dist/%.js: src/%.js
	mkdir -p $(@D)
	./node_modules/.bin/babel $< -o $@
