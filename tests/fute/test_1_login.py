#!/usr/bin/env python3
################################################################
# This file contains functional tests for:
#  - user login and logout
#
# This file is part of Qvain project.
#
# Author(s):
#     Juhapekka Piiroinen <juhapekka.piiroinen@csc.fi>
#
# Copyright 2019 CSC - IT Center for Science Ltd.
# All Rights Reserved.
################################################################

from qvaintestcase import QvainTestCase


class BasicLoginAndLogout(QvainTestCase):
    def test_authentication(self):
        self.login()
        self.verify_that_user_is_logged_in()
        self.logout()

    def end_test(self):
        pass
