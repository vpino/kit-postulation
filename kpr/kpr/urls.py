from django.conf.urls import url, include
from authentication.views import AccountViewSet, LoginView, LogoutView
from postulations.views import AccountPostsViewSet, PostViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import IndexView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'posts', PostViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)

accounts_router.register(r'posts', AccountPostsViewSet)


urlpatterns = [
    url(r'^postulation/', include(router.urls)),
    url(r'^postulation/', include(accounts_router.urls)),
    url(r'^postulation/login/$', LoginView.as_view(), name='login'),
    url(r'^postulation/logout/$', LogoutView.as_view(), name='logout'),
    url('^.*$', IndexView.as_view(), name='index')
]