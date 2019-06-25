#!/usr/bin/env python3
################################################################
# This file contains the helper wrapper for My Datasets view.
#
# This file is part of Qvain project.
#
# Author(s):
#     Juhapekka Piiroinen <juhapekka.piiroinen@csc.fi>
#
# Copyright 2019 CSC - IT Center for Science Ltd.
# All Rights Reserved.
################################################################

import time
import uuid


class Datasets(object):
    def __init__(self, testcase):
        self.testcase = testcase
        self.retries = 0
        self.set_input_language()

    def close(self):
        self.testcase.open_frontpage()

    def set_input_language(self, language="English", language_short="en"):
        self.language = language
        self.language_short = language_short

    def create(self):
        pass  # TODO

    def remove_all(self):
        pass  # TODO

    def is_publish_visible(self, dataset_id):
        dataset_id = self.workaround_cscqvain_171(dataset_id)
        row = self.testcase.find_element("dataset-list__row_{id}".format(id=dataset_id))
        actions_td = row.find_elements_by_css_selector("td")[4]
        # TODO: there is no ID or anything for the buttons in actions.
        return actions_td.find_elements_by_class_name("btn")[1].text == "Publish"

    def workaround_cscqvain_171(self, dataset_id):
        return str(uuid.UUID(dataset_id))

    def is_draft(self, dataset_id):
        return self.get_state(dataset_id).find("Draft") != -1

    def is_pending_changes(self, dataset_id):
        return self.get_state(dataset_id).find("Pending Changes") != -1

    def is_published(self, dataset_id):
        return self.get_state(dataset_id).find("Published") != -1

    def get_state(self, dataset_id):
        dataset_id = self.workaround_cscqvain_171(dataset_id)
        row = self.testcase.find_element("dataset-list__row_{id}".format(id=dataset_id))
        text = row.find_elements_by_css_selector("td")[0].find_element_by_css_selector("p").text
        return text

    def search(self, title):
        # get the list of rows
        dataset_list = self.testcase.find_element("dataset-list")
        dataset_rows = dataset_list.find_elements_by_css_selector("tbody > tr")

        # we need to cancel the special case when the data is loading
        # there is an UI issue where "There are no records to show" is shown.
        if len(dataset_rows) == 1:
            if self.retries > 5:
                self.retries = 0
                return False
            time.sleep(1)
            self.retries += 1
            return self.search(title)

        # lets see those titles if we can find any
        found = []
        for row in dataset_rows:
            if row.find_elements_by_css_selector("td")[1].find_element_by_css_selector("h5").text == title:
                found.append(row.get_attribute("id").replace("dataset-list__row_", ""))
        return found

    def exists(self, dataset_id):
        dataset_id = self.workaround_cscqvain_171(dataset_id)
        return self.testcase.elem_is_not_found("dataset-list__row_{id}".format(id=dataset_id))

    def remove(self, dataset_id):
        dataset_id = self.workaround_cscqvain_171(dataset_id)
        # find the correct row and the actions cell
        row = self.testcase.find_element("dataset-list__row_{id}".format(id=dataset_id))
        actions_td = row.find_elements_by_css_selector("td")[4]

        # press more button
        dropdown = actions_td.find_element_by_css_selector(".dropdown")
        more_dropdown = dropdown.find_element_by_class_name("dropdown-toggle")
        more_dropdown.click()

        # find the delete option
        delete_option = dropdown.find_element_by_class_name("dropdown-menu").find_elements_by_class_name("dropdown-item")[1]
        delete_option.click()

        # press delete on the modal dialog
        deleteModalFooter = self.testcase.find_element("deleteModal___BV_modal_footer_")
        deleteBtn = self.testcase.wait_until_clickable_by_class(deleteModalFooter, "btn-danger")
        deleteBtn.click()

        # ensure that the modal is gone
        # this should work with the animation, to be done better later.
        retries = 0
        while retries < 5:
            if (self.testcase.elem_is_not_found("deleteModal")):
                break
            time.sleep(0.5)
            retries += 1

        # hide alert with "successfully deleted dataset"
        msg = self.testcase.get_alert_text()
        assert msg.find("successfully deleted dataset") != -1
        self.testcase.close_alert()

    def edit(self, dataset_id):
        dataset_id = self.workaround_cscqvain_171(dataset_id)
        row = self.testcase.find_element("dataset-list__row_{id}".format(id=dataset_id))
        actions_td = row.find_elements_by_css_selector("td")[4]
        # TODO: there is no ID or anything for the buttons in actions.
        actions_td.find_elements_by_class_name("btn")[0].click()

    def view_in_etsin(self, dataset_id):
        pass  # TODO

    def list_all(self):
        pass  # TODO

    def scroll_list_to(self, dataset_id):
        dataset_id = self.workaround_cscqvain_171(dataset_id)
        row = self.testcase.find_element("dataset-list__row_{id}".format(id=dataset_id))
        self.testcase.scroll_to_element(row)

    def show(self):
        self.testcase.open_frontpage()

        time.sleep(2)

        # lets tap the navigation bar where we should see the link
        self.testcase.find_element_by_text("My Datasets").click()

        # lets wait until the page has been loaded
        self.testcase.ensure_view_title(
            title='My datasets',
            error_msg="We are not in My datasets view, it seems that we are in {header}"
        )
