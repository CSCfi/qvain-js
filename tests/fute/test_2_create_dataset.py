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
#  - dataset creation
################################################################

from qvaintestcase import QvainTestCase
from views.editor import Editor
from views.datasets import Datasets


class TestCreateDataset(QvainTestCase):
    def test_2_ensure_that_testdata_does_not_exist(self):
        datasets = Datasets(self)
        editor = Editor(self)
        self.login()
        # ensure that the test datasets does not exist before create.
        datasets.show()
        test_datasets = [
            "test_create_new_dataset_valid_unpublished",
            "test_create_new_dataset_invalid_unpublished"
        ]

        while 1:
            was_removed = False
            for test_dataset in test_datasets:
                dataset_ids = datasets.search(test_dataset)
                if dataset_ids:
                    for dataset_id in dataset_ids:
                        datasets.remove(dataset_id)
                        was_removed = True
            if not was_removed:
                break

        datasets.close()

        #####
        # create a new dataset
        # valid dataset, unpublished
        self.mark_memory_measure("created valid unpublished dataset")
        editor.show()
        editor.select_schema("att")

        editor.show_content_description_tab()
        editor.set_title("test_create_new_dataset_valid_unpublished")
        editor.set_description("dataset description")

        editor.show_actors_tab()
        editor.set_creator_organization("Test Organization")

        editor.show_rights_and_licenses_tab()
        editor.set_access_type("Open")
        editor.set_license("Apache Software License 2.0")

        (test_1_my_datasets_valid_unpublished_id, was_resave) = editor.save()
        assert not was_resave, "Expected to see first time save"
        self.diff_memory_measure_and_report("created valid unpublished dataset")
        editor.close()

        #####
        # create a new dataset
        # invalid dataset, unpublished
        self.mark_memory_measure("created invalid unpublished dataset")
        editor.show()
        editor.select_schema("att")

        editor.show_content_description_tab()
        editor.set_title("test_create_new_dataset_invalid_unpublished")
        editor.set_description("dataset description")

        (test_1_my_datasets_invalid_unpublished_id, was_resave) = editor.save()
        assert not was_resave, "Expected to see first time save"
        self.diff_memory_measure_and_report("created invalid unpublished dataset")

        #####
        # Verify that the datasets were added and can be seen in datasets.
        # test that the buttons are shown correctly and that the status is correct
        datasets.show()

        # we need to do a workaround for the loading bug
        retries = 0
        while retries < 5:
            if (self.elem_is_not_found("test_create_new_dataset_invalid_unpublished")):
                break
            retries += 1
        assert retries < 5, "The datasets could not be loaded"

        dataset_ids = datasets.search("test_create_new_dataset_invalid_unpublished")
        assert len(dataset_ids) == 1, "There should be only one test_create_new_dataset_invalid_unpublished"

        dataset_ids = datasets.search("test_create_new_dataset_valid_unpublished")
        assert len(dataset_ids) == 1, "There should be only one test_create_new_dataset_valid_unpublished"

    def end_test(self):
        pass
