# Copyright (c) 2022, alex and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Exam(Document):

	def validate(self):
		if self.slot_open > self.slot_close:
			frappe.throw("Slot Open time should be before Slot Close time")
		if self.questions == []:
			frappe.throw("please select questions")
		if self.the_number_of_users == self.attended_count:
			self.status = "Close"