# Liberated Pixel Cup sphinx extensions
# Copyright (C) 2012 Liberated Pixel Cup contributors
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from docutils import nodes
from sphinx.util.compat import Directive
from docutils.parsers.rst import directives

import os

def setup(app):
    app.add_directive('asset', AssetDirective)


class asset_node(nodes.paragraph, nodes.Element):
    pass


class AssetDirective(Directive):
    required_arguments = 1
    optional_arguments = 0

    option_spec = {
        'name': directives.unchanged}

    def run(self):
        img_url = self.arguments[0]
        par_node = nodes.paragraph()
        name = self.options.get('name', os.path.split(self.arguments[0])[1])

        image_container = nodes.container()
        image_node = nodes.image(uri=img_url, alt=name)
        image_container += image_node
        label_node = nodes.emphasis(name, name)
        par_node += [image_container, label_node]

        return [par_node]
