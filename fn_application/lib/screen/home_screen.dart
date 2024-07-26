import 'dart:convert';

import 'package:card_swiper/card_swiper.dart';
import 'package:fn_application/screen/post_detail_screen.dart';
import 'package:fn_application/service/auth_service.dart';
import 'package:fn_application/screen/page_detail_screen.dart';
import 'package:fn_application/service/page_service.dart';
import 'package:fn_application/service/post_service.dart';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../config/app.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> banners = [];
  List<dynamic> pages = [];
  List<dynamic> posts = [];
  Future<void> fetchBanners() async {
    try {
      final response = await http.get(Uri.parse('$API_URL/api/banners'));
      final banners = jsonDecode(response.body);
      print(banners);
      setState(() {
        this.banners = banners;
      });
    } catch (e) {
      print(e);
    }
  }

  Future<void> fetchPages() async {
    try {
      List<dynamic> pages = await PageService.fetchPages();
      setState(() {
        this.pages = pages;
      });
    } catch (e) {
      print(e);
    }
  }

  Future fetchPosts() async {
    try {
      List<dynamic> posts = await PostService.fetchPosts();
      setState(() {
        this.posts = posts;
      });
    } catch (e) {
      print(e);
    }
  }

  @override
  void initState() {
    super.initState();
    AuthService.checkLogin().then((loggedIn) {
      if (!loggedIn) {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    });

    fetchBanners();
    fetchPages();
    fetchPosts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: ListView(
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),  
              child: Text('Drawer Header'),
            ),
            ListView.builder(
              shrinkWrap: true,
              itemCount: pages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => PageDetailScreen(
                          id: pages[index]['id'],
                        ),
                      ),
                    );
                  },
                  title: Text(pages[index]['title']),
                );
              },
            ),
          ],
        ),
      ),
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              height: 250,
              child: Swiper(
                autoplay: true,
                itemCount: banners.length,
                itemBuilder: (context, index) {
                  return Image.network(
                    '$API_URL/${banners[index]['imageUrl']}',
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'เกี่ยวข้อง',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            ListView.builder(
              shrinkWrap: true,
              itemCount: posts.length,
              itemBuilder: (context, index) {
                return ListTile(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => PostDetailScreen(
                          id: posts[index]['id'],
                        ),
                      ),
                    );
                  },
                  title: Text(posts[index]['title']),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
