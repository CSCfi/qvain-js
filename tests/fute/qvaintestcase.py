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
# This contains the base class QvainTestCase with some helper
# functions for tests.
################################################################
import os
from tauhka.testcase import TauhkaTestCase
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementClickInterceptedException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By


class QvainTestCase(TauhkaTestCase):
    def is_frontend_running(self):
        # This is the xpath for default error page header in nginx
        # We do not have such xpath in our frontend
        assert self.elem_is_not_found_xpath(
            "/html/body/center[1]/h1"), "Frontend is not running"

    def verify_that_user_is_logged_in(self):
        self.open_usermenu()
        usermenu_fullname = self.find_element("usermenu_fullname")
        error_msg = "the user ({user} != {expected}) is not logged in"
        was_user_fullname = os.environ["TEST_FULLNAME"] in usermenu_fullname.text
        assert was_user_fullname, error_msg.format(user=usermenu_fullname.text, expected=os.environ["TEST_FULLNAME"])
        self.close_usermenu()

    def open_frontpage(self):
        # The top does not actually get you to the frontpage
        appTopBarImage = self.driver.find_element_by_xpath('//*[@id="app-topbar"]/a/img')
        appTopBarImage.click()

    def login(self,
              username=os.environ["TEST_USERNAME"],
              password=os.environ["TEST_PASSWORD"],
              address=os.environ["TEST_ADDRESS"]):
        assert "https://qvain.csc.local" in address, "These tests can be ran only against local instance."

        # lets ensure that we are on our first initial page
        self.open_url(address)
        self.is_frontend_running()
        self.wait_until_window_title_contains("Qvain")
        self.driver.execute_script(
            "document.body.setAttribute('style','\
            -webkit-transition:none !important; \
            -moz-transition:none !important; \
            -o-transition:none !important; \
            transition:none !important')")

        # lets tap the user menu login
        login_button = self.driver.find_element_by_id("usermenu_login")
        login_button.click()

        # we will get a page redirection to another service
        try:
            self.wait_until_window_title_contains("local-dev-auth - Login")
            username_input = self.find_element("username")
            username_input.send_keys(username)
            password_input = self.find_element("password")
            password_input.send_keys(password)
            login_button = self.find_element("accept")
            login_button.click()

            self.wait_until_window_title_contains("local-dev-auth - Consent")
            login_button_consent = self.find_element("accept")
            login_button_consent.click()
        except TimeoutException:
            try:
                self.wait_until_window_title_contains("Login")
                btn = self.find_element_by_class_name("login-button-container")
                loginHakaTestBtn = btn.find_elements_by_class_name("login-link")[1]
            except TimeoutException:
                self.wait_until_window_title_contains("Web Login Service")
                try:
                    loginHakaTestBtn = self.find_element_by_text("authn/LoginHakaTest")
                except NoSuchElementException:
                    loginHakaTestBtn = self.find_element_by_text("Haka Login")
            loginHakaTestBtn.click()

            # we will get a page redirection to another service again
            self.wait_until_window_title_contains("Haka — WAYF")
            self.select_option_by_value(
                "userIdPSelection",
                "https://testidp.funet.fi/idp/shibboleth"
            )
            userIdpSelectButton = self.find_element_by_name("Select")
            userIdpSelectButton.click()

            # we will get a page redirection to another service again too
            self.wait_until_window_title_contains("CSC - Haka test IdP")
            usernameInput = self.find_element("username")
            usernameInput.send_keys(username)
            passwordInput = self.find_element("password")
            passwordInput.send_keys(password)

            loginButton = self.find_element_by_name("_eventId_proceed")
            loginButton.click()

        # we should have been redirected back to the our web service
        self.wait_until_window_title_contains("Qvain")

    def open_usermenu(self):
        userDropdown = self.find_element("usermenu")
        self.wait_until_visible(userDropdown)
        userDropdown.click()

    def close_usermenu(self):
        userDropdown = self.find_element("usermenu")
        self.wait_until_visible(userDropdown)
        userDropdown.click()

    def logout(self):
        if self.elem_is_not_found("usermenu"):
            return
        self.open_usermenu()
        signoutMenuItem = self.find_element("usermenu_signout")
        signoutMenuItem.click()

    def button_is_disabled(self, btn):
        assert "disabled" in btn.get_attribute("class"), "It looks like that the button was ENABLED."

    def button_is_enabled(self, btn):
        assert "disabled" not in btn.get_attribute("class"), "It looks like that the button was DISABLED"

    def close_alert(self):
        retries = 5
        error = None
        while (retries > 0):
            try:
                alert_box = self.wait_until_located_by_id('root_alert')
                self.wait_until_visible(alert_box)
                close_alert_btn = alert_box.find_element_by_class_name("close")
                self.wait_until_visible(close_alert_btn)
                close_alert_btn.click()
                self.wait_until_hidden_by_id("root_alert")
                error = None
                retries = 0
            except ElementClickInterceptedException as err:
                error = err
                retries -= 1
        if error:
            raise error

    def get_alert_text(self):
        alertTextElem = self.wait_until_located_by_id('root_alert').find_element_by_css_selector("p")
        return alertTextElem.text

    def ensure_view_title(self, title, error_msg):
        header = self.wait_until_located_by_xpath('//*[@class="component-title"]')
        assert title in header.text, error_msg.format(header=header.text)

    def open_dropdown(self, elemId):
        self.wait_until_clickable_by_id(elemId)
        self.find_element(elemId).find_element_by_class_name("dropdown-toggle").click()

    def wait_until_clickable_by_id(self, elemId):
        return self.wait.until(EC.element_to_be_clickable((By.ID, elemId)))

    def wait_until_clickable(self, elem):
        return self.wait.until(EC.element_to_be_clickable(elem))

    def select_dropdown_option(self, elemId, option):
        menu = self.find_element(elemId)
        self.wait_until_clickable_by_class(menu, "dropdown-item")
        options = menu.find_element_by_class_name("dropdown-menu").find_elements_by_class_name("dropdown-item")
        for opt in options:
            if opt.text == option:
                opt.click()
                return
        raise NoSuchElementException(option)

    def select_option_from_multiselect(self, elemId, optionValue):
        # lets open the multiselect
        self.wait_until_located_by_id(elemId)
        elem = self.find_element(elemId)
        multiselect = elem.find_element_by_class_name("multiselect")
        multiselect.click()

        # lets scan for the options which are available.
        multiselect_content = elem.find_element_by_class_name("multiselect__content")

        tries = 5
        errors = []
        while tries > 0:
            tries -= 1
            multiselect_options = multiselect_content.find_elements_by_class_name("multiselect__element")

            # this can fail when the network connection is not working properly.
            # so lets ensure that we did get more than zero options
            if len(multiselect_options) == 0:
                errors.append("We did not find any options from the multiselect")
                continue

            # lets find the option from the list of found options
            for option in multiselect_options:
                if option.text.find(optionValue) > -1:
                    # once we found it we click on it
                    self.wait_until_visible(option)
                    option.click()
                    self.wait.until(EC.invisibility_of_element_located(option))
                    return

            errors.append("Unable to find " + optionValue)

        # we did not find the option from the list
        raise NoSuchElementException("{option} was not found from {elem} ".format(option=optionValue, elem=elemId))

    def get_url(self):
        return self.driver.current_url
