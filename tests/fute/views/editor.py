#!/usr/bin/env python3
################################################################
# This file contains the helper wrapper for Editor view.
#
# This file is part of Qvain project.
#
# Author(s):
#     Juhapekka Piiroinen <juhapekka.piiroinen@csc.fi>
#
# Copyright 2019 CSC - IT Center for Science Ltd.
# All Rights Reserved.
################################################################

from .datasets import Datasets


class Editor(object):
    def __init__(self, testcase):
        self.testcase = testcase
        self.dataset_id = None
        self.set_input_language()

    def set_input_language(self, language="English", language_short="en"):
        self.language = language
        self.language_short = language_short

    def show(self):
        self.testcase.open_frontpage()
        datasets = Datasets(self.testcase)
        datasets.show()

        # lets tap on the create new record button
        self.testcase.find_element('button-new-dataset').click()

        # we should end up into new dataset page
        self.testcase.ensure_view_title(
            title="Where are your files related to this dataset?",
            error_msg="We are not in New Dataset view, it seems that we are in '{header}'"
        )

    def close(self):
        self.dataset_id = None
        self.testcase.open_frontpage()

    def select_schema(self, schema):
        card = self.testcase.find_element(schema)
        select_button = card.find_element_by_class_name("btn-primary").click()

    def save(self):
        self.testcase.scroll_to_up()
        before_url = self.testcase.get_url()
        resave = not ("new" in before_url)
        self.testcase.click_elem("editor_button_save_top")

        url = self.testcase.get_url()
        self.dataset_id = url.split("/")[-2]

        return self.dataset_id, resave

    def show_content_description_tab(self):
        self.testcase.scroll_to_up()
        navigation = self.testcase.find_element_by_class_name("editor-index-navigation")
        navigation.find_element_by_xpath('//a[contains(@href, "description")]').click()

    def show_actors_tab(self):
        self.testcase.scroll_to_up()
        navigation = self.testcase.find_element_by_class_name("editor-index-navigation")
        navigation.find_element_by_xpath('//a[contains(@href, "actors")]').click()

    def show_rights_and_licenses_tab(self):
        self.testcase.scroll_to_up()
        navigation = self.testcase.find_element_by_class_name("editor-index-navigation")
        navigation.find_element_by_xpath('//a[contains(@href, "rights")]').click()

    def set_title(self, title):
        elemId = "title_{language_short}_input".format(language_short=self.language_short)
        self.testcase.clear_text(elemId)
        self.testcase.enter_text(
            elemId,
            title
        )

    def set_description(self, description):
        description_tab = self.testcase.find_element("description_tab-selector")
        nav = description_tab.find_element_by_class_name("nav-pills")
        nav.find_element_by_link_text(self.language).click()

        elemId = "description_textarea-{language_short}".format(language_short=self.language_short)
        self.testcase.clear_text(elemId)
        self.testcase.enter_text(
            elemId,
            description
        )

    def set_creator_organization(self, organizationName):
        # Creator of the dataset
        self.testcase.click_elem("creator_array_button_add")

        # add then an organization
        container = self.testcase.find_element("tab_0_object")
        organization_button = container.find_element_by_xpath('//button[contains(text(), "Organization")]')
        organization_button.click()

        # enter text to the searchbox in the dropdown
        dropdown_entrybox = self.testcase.wait_until_located_by_id("0_referenceData")
        dropdown_entrybox.click()

        self.testcase.clear_text("0_value-select")
        self.testcase.enter_text("0_value-select", organizationName)

        # then select that manual value from dropdown
        refdata = self.testcase.find_element("0_referenceData")
        item = refdata.find_element_by_xpath('//li[@class="multiselect__element"]//div[contains(text(), "- Add Organization Manually -")]')
        item.click()

    def set_access_type(self, access_type):
        self.testcase.select_option_from_multiselect("tab_access_type_object", access_type)

    def set_license(self, dataset_license):
        self.testcase.select_option_from_multiselect("tab_license_array", dataset_license)

    def verify_owner(self, owner):
        assert self.testcase.is_option_selected(
                    "editor_select_owner",
                    owner
                ), "The currently logged in user is not marked as owner of the dataset."

    def publish(self):
        self.testcase.scroll_to_up()
        btn = self.testcase.find_element("editor_button_publish_top")
        btn.click()

        # verify that a confirmation was opened
        self.testcase.wait_until_visible_by_id("publish-verification-card")

        # click on the Publish button which is on the confirmation
        verification_btn = self.testcase.find_element("publish-verification-card-button-publish")
        verification_btn.click()

        # wait until the alert appears
        alert_text = self.testcase.get_alert_text()

        # check that there are no failure dialogs visible
        if self.testcase.is_element_visible("publish-modal"):
            # close the modal dialog, to avoid any issues
            modal_footer = self.testcase.find_element("publish-modal___BV_modal_footer_")
            modal_footer.find_element_by_class_name("btn-primary").click()
            self.testcase.wait_until_hidden_by_id("publish-modal")

            # close the alert
            self.testcase.close_alert()
            return False

        # close the alert
        self.testcase.close_alert()

        return alert_text.find("Dataset successfully published") != -1

    def verify_publish_and_save_buttons(self, save, publish, bottom_visible):
        saveButtons = []
        publishButtons = []

        saveButtons.append(self.testcase.find_element("editor_button_save_top"))
        publishButtons.append(self.testcase.find_element("editor_button_publish_top"))

        if bottom_visible:
            publishButtons.append(self.testcase.find_element("editor_button_publish_bottom"))
            saveButtons.append(self.testcase.find_element("editor_button_save_bottom"))
        else:
            assert self.testcase.elem_is_not_found("editor_button_publish_bottom"), "editor_button_publish_bottom was visible"
            assert self.testcase.elem_is_not_found("editor_button_save_bottom"), "editor_button_save_bottom was visible"

        for btn in saveButtons:
            if save:
                self.testcase.button_is_enabled(btn)
            else:
                self.testcase.button_is_disabled(btn)

        for btn in publishButtons:
            if publish:
                self.testcase.button_is_enabled(btn)
            else:
                self.testcase.button_is_disabled(btn)
