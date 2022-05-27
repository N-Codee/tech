# Copyright (c) 2022, alex and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Exam(Document):
	pass

@frappe.whitelist()
def test(quality_inspection_template):
	return frappe.db.sql(""" select questions from `tabExam` """,as_dict=1)