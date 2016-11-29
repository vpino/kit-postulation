from rest_framework import permissions, viewsets
from rest_framework.response import Response

from postulations.models import Postulation
from postulations.permissions import IsAuthorOfPost
from postulations.serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Postulation.objects.order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    """
    perform_create. Nosotros simplemente agarramos el usuario asociado 
    a esta solicitud y les hacemos el autor de este post.
    """
    def perform_create(self, serializer):
    	instance = serializer.save(author=self.request.user)

    	return super(PostViewSet, self).perform_create(serializer)

class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Postulation.objects.select_related('author').all()
    serializer_class = PostSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)