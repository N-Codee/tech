# Copyright (c) 2022, alex and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ExamRecords(Document):
	
	def validate(self):
		total = 0
		for row in self.get("exam_records_details"):
			self.total_mark += row.mark