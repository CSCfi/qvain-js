# This file is part of Qvain -project.
# 
# Author(s):
# 	Juhapekka Piiroinen <juhapekka.piiroinen@csc.fi>
# 
# License: GPLv3
# 
# See LICENSE file for more information.
# Copyright (C) 2019 Ministry of Culture and Education, Finland.
# All Rights Reserved.
################################################################
# This file contains functional tests for:
#  - user login and logout
################################################################

from qvaintestcase import QvainTestCase


class BasicLoginAndLogout(QvainTestCase):
    def test_authentication(self):
        self.login()
        self.verify_that_user_is_logged_in()
        self.logout()

    def end_test(self):
        pass
