
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Header from '../component/Header';


const API_KEY = '36456e3684d64096a0cca86796f80154';
const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

interface Article {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
}

const NewsScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchNews = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}&page=${pageNumber}`);
      if (pageNumber === 1) {
        await AsyncStorage.setItem('news', JSON.stringify(response.data.articles));
      }
      setArticles(prev => (pageNumber === 1 ? response.data.articles : [...prev, ...response.data.articles]));
      setPage(pageNumber);
    } catch (error) {
      const cachedNews = await AsyncStorage.getItem('news');
      if (cachedNews) {
        setArticles(JSON.parse(cachedNews));
      } else {
        alert('Failed to load news and no cached data available.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const loadMoreNews = () => {
    if (!loading) {
      fetchNews(page + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews(1);
    setRefreshing(false);
  };

  const renderSkeleton = () => (
    <SkeletonPlaceholder>
      <View style={styles.articleContainer}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonText} />
        <View style={[styles.skeletonText, styles.skeletonTextShort]} />
      </View>
    </SkeletonPlaceholder>
  );

  const renderItem = ({ item }: { item: Article }) => (
    <View style={styles.articleContainer}>
      <Text style={styles.title}>{item.title}</Text>
      {item.urlToImage ? <Image source={{ uri: item.urlToImage }} style={styles.image} /> : null}
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity>
        <Text style={styles.readMore}>Read More</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <Header />
      <TextInput
        style={styles.searchBar}
        placeholder="Search news..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading && !articles.length ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeleton}
        />
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onEndReached={loadMoreNews}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#000" /> : null}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    margin: 10,
  },
  articleContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  readMore: {
    color: 'blue',
    marginTop: 5,
    marginHorizontal: 10,
  },
  image: {
    width: '93%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  skeletonTitle: {
    width: '80%',
    height: 20,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  skeletonImage: {
    width: '93%',
    height: 200,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  skeletonText: {
    width: '100%',
    height: 15,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginBottom: 5,
  },
  skeletonTextShort: {
    width: '60%',
  },
});

export default NewsScreen;

function alert(arg0: string) {
    throw new Error('Function not implemented.');
}
