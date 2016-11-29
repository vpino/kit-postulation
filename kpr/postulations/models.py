from django.db import models

from authentication.models import Account

class Postulation(models.Model):

	repository = models.URLField('url of reposity of project', max_length=100, unique=True)
	name_postulation = models.CharField('name postulation', max_length=50, unique=True)
	description_postulation = models.TextField('description of the postulation', max_length=100)
	status = models.CharField('status of postulation', max_length=20, default='Recibido')
	author = models.ForeignKey(Account)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ('name_postulation',)
			
	
	def __str__(self):
		return self.name_postulation()