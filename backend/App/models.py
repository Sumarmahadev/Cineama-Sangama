
    

from django.db import models




class Movie(models.Model):
    title = models.CharField(max_length=100)
    language = models.CharField(max_length=50)

    image = models.ImageField(upload_to='movies/', max_length=500)

    video = models.FileField(
        upload_to='videos/',
        max_length=500,
        null=True,
        blank=True
    )

    trailer = models.FileField(
        upload_to='trailers/',
        max_length=500,
        null=True,
        blank=True
    )

    description = models.TextField(null=True, blank=True)
    genre = models.CharField(max_length=50, null=True, blank=True)
    release_year = models.IntegerField(null=True, blank=True)
    rating = models.FloatField(default=0)

    is_top = models.BooleanField(default=False)

    def __str__(self):
        return self.title


   
#favo
from django.db import models
from django.conf import settings


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    movie = models.ForeignKey(
        "Movie",
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")

    def __str__(self):
        return f"{self.user} - {self.movie.title}"