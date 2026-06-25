from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Movie
from .serializers import MovieSerializer

@api_view(['GET'])
def get_movies(request):
    language = request.GET.get('language')  # get query param

    if language:
        movies = Movie.objects.filter(language=language)
    else:
        movies = Movie.objects.all()

    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def movie_detail(request, pk):
    try:
        movie = Movie.objects.get(pk=pk)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)

    serializer = MovieSerializer(movie)
    return Response(serializer.data)