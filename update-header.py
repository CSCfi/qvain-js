#!/usr/bin/env python3
#################################################
# This file is part of Qvain -project.
#
# Author(s):
#   Juhapekka Piiroinen <juhapekka.piiroinen@csc.fi>
#
# License: GPLv3
# See LICENSE file for more information.
#
# Copyright (C) 2019 Ministry of Culture and Education, Finland.
# All Rights Reserved.
#################################################
"""Replace license headers.

Usage:
  update_header.py --license_file=file <path>...
  update_header.py (-h | --help)
  update_header.py --version

Options:
  -h --help     Show this screen.
  --version     Show version.
"""

from docopt import docopt
import mimetypes
import os
import textwrap
from git import Repo
from git.exc import GitCommandError


if __name__ == '__main__':
    arguments = docopt(__doc__, version='Update header')
    license_header = ""
    with open(arguments['--license_file'],"r") as header:
        license_header = header.read()

    for path in arguments['<path>']:
        repo = Repo(path)
        for root, dirs, files in os.walk(path, topdown = False):
            for name in files:
                file_name = os.path.join(root, name)
                
                
                if not file_name.endswith("js") and \
                   not file_name.endswith("vue") and \
                   not file_name.endswith("py"):
                    continue
                authors = {}
                try:
                    for commit, lines in repo.blame('HEAD', file_name):
                        if commit.author.name not in authors.keys():
                            authors[commit.author.name] = commit.author.email
                except GitCommandError:
                    continue

                authors_list = ""
                for author in authors.keys():
                    authors_list += "\t{name} <{email}>\n".format(name=author, email=authors[author])
                license_header = license_header.replace("<ADD_AUTHORS_HERE>", authors_list)

                with open(file_name, "r+") as f:
                    was_found = False
                    data = f.readline()
                    JS_COMMENT="/* ADD_LICENSE_HEADER */"
                    HTML_COMMENT="<!-- ADD_LICENSE_HEADER -->"
                    PYTHON_COMMENT="# ADD_LICENSE_HEADER"
                    if JS_COMMENT in data:
                        was_found = True
                        data = "/*\n{license}\n*/\n".format(license=license_header)
                    elif HTML_COMMENT in data:
                        was_found = True
                        data = "<!--\n{license}\n-->\n".format(license=license_header)
                    elif PYTHON_COMMENT in data:
                        was_found = True
                        data = "{license}\n".format(license=textwrap.indent(license_header, "# ", lambda line: True))
                    if was_found:
                        data += f.read()
                        f.seek(0)
                        f.write(data)

                if was_found:
                    print("[FIX] {filename}".format(filename=file_name))
                else:
                    print("[OK] {filename}".format(filename=file_name))


    #with open(sys.argv[1])

