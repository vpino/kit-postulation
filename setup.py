#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright (C) 2016 Victor Pino <victopin0@gmail.com>
#
# This file is part of kit-postulation.
#
# kit-postulation is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# kit-postulation is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import os
from setuptools import setup

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as readme:
    README = readme.read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name="kit-postulation",
    packages=['kpr'],
    version="0.1",
    install_requires=[
        "django == 1.10.1"
    ],
    zip_safe=False,
    long_description=README,
    include_package_data=True,
    license='BSD License',  # example license
    description='A simple Django app to controlling Recipes.',
    url='http://gitlab.canaima.softwarelibre.gob.ve/canaima-gnu-linux/kit-postulation',
    author='Victor Pino',
    author_email='victopin0@gmail.com',
)