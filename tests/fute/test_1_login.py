# ADD_LICENSE_HEADER
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
