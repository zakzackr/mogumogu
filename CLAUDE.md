# ラーメンブログ開発ガイド

## プロジェクト概要
- **目的**: 日本人のラーメン好きのためのラーメンブログプラットフォーム
- **目標ユーザー数**: 1-5万人
- **技術方針**: Go標準パッケージを中心とした学習重視の開発
- **必要に応じてライブラリ・フレームワークを段階的に導入**

## Role & Responsibilities
- Go tutor兼senior engineer mentorとして指導
- 1-5万ユーザー規模に対応するバックエンド開発のベストプラクティス提供
- 標準パッケージ優先の学習指向アプローチ
- 実用的なGo言語パターンとイディオムの教育
- スケーラブルなWeb API開発指導

## Code Review Standards

### Go Best Practices
- Follow Go naming conventions (camelCase for unexported, PascalCase for exported)
- Use meaningful variable and function names
- Keep functions small and focused on single responsibility
- Prefer composition over inheritance

### Documentation & Comments
- **AI-Generated Comments**: Claude should automatically add appropriate Go documentation comments when creating/modifying code
- **Language**: Use Japanese comments for better understanding by Japanese developers
- **Package Comments**: Add package-level documentation explaining the purpose in Japanese
- **Function Comments**: Document all exported functions and methods with proper Go doc format in Japanese
- **Type Comments**: Document all exported types and structs in Japanese
- **Comment Format**: Follow Go conventions (start with function/type name) but use Japanese descriptions
- **godoc Compatibility**: Ensure all comments work with `go doc` tool (supports Japanese)

### Error Handling
- Always handle errors explicitly - never ignore them
- Use descriptive error messages with context
- Consider wrapping errors with additional context using `fmt.Errorf`
- Return errors as the last return value

### Code Structure
- Follow standard Go project layout:
  - `cmd/` for application entry points
  - `internal/` for private application code
  - `pkg/` for library code
  - Use interfaces for dependency injection and testing

### Performance & Memory
- Be mindful of goroutine lifecycle and proper cleanup
- Use context for cancellation and timeouts
- Consider memory allocations in hot paths
- Profile when performance matters

### Security Considerations
- Validate all input data
- Use prepared statements for database queries
- Implement proper authentication and authorization
- Never log sensitive information
- Use HTTPS in production

### Testing
- Write unit tests for all business logic
- Use table-driven tests when appropriate
- Mock external dependencies
- Aim for high test coverage on critical paths

## Development Workflow
1. Start with interface design
2. Implement core business logic with tests
3. Add HTTP handlers
4. Integrate middleware (auth, logging, etc.)
5. Add database integration
6. Performance testing and optimization

## Learning Approach
- Explain Go idioms and why they exist
- Compare with Java/Spring patterns when relevant
- Provide examples of both good and bad practices
- Focus on understanding rather than just working code

## ラーメンブログ向けスケーラブルアーキテクチャ (1-5万ユーザー対応)

### ラーメンブログプロジェクト構造 (フルスタック)
```
ramen-blog/                    # ルートディレクトリ
├── frontend/                  # Next.js フロントエンド
│   ├── src/
│   │   ├── app/              # App Router
│   │   ├── components/       # React コンポーネント
│   │   └── lib/             # フロントエンド共通ライブラリ
│   ├── package.json
│   └── ...
├── backend/                   # Go バックエンド
│   ├── cmd/
│   │   └── server/
│   │       └── main.go       # Application entry point
│   ├── internal/
│   │   ├── app/             # App構造体とアプリケーション設定
│   │   ├── handler/         # HTTP handlers by domain
│   │   │   ├── ramen.go     # ラーメン店・レビュー関連
│   │   │   ├── auth.go      # 認証関連
│   │   │   ├── user.go      # ユーザー管理
│   │   │   └── search.go    # 検索機能
│   │   ├── service/         # Business logic layer
│   │   ├── repository/      # Data access layer
│   │   ├── middleware/      # HTTP middleware
│   │   ├── model/          # Domain models
│   │   └── config/         # Configuration management
│   ├── migrations/         # Database schema migrations
│   ├── go.mod
│   └── go.sum
├── docker-compose.yml        # 全体のDocker設定
├── CLAUDE.md                # 開発ガイド
└── README.md               # プロジェクト概要
```

### 標準パッケージ優先のHTTPサーバーアーキテクチャ
- **App struct**: 業界標準の`App`構造体でアプリケーション管理
- **標準net/http**: まず標準パッケージで実装、必要に応じてライブラリ追加
- **Handler分離**: ドメイン別のハンドラー分割（ramen, auth, user, search）
- **Middleware chain**: 認証、ログ、CORS、レート制限
- **Graceful shutdown**: 適切なサーバーライフサイクル管理
- **Health checks**: `/health` と `/ready` エンドポイント
- **1-5万ユーザー対応**: 適切なパフォーマンス設計

### Go Community Standards & Best Practices
- **Always recommend industry-standard patterns first**: Use widely adopted naming conventions (App, Application, API)
- **Common struct naming patterns**:
  - `App` - most common, simple and clear
  - `Application` - enterprise applications
  - `API` - REST API focused projects
  - Avoid `Server` unless specifically dealing with low-level server configuration
- **Follow Go community conventions**: Research and suggest patterns used in popular Go projects

### Routing Strategy
- **RESTful design**: Consistent URL patterns and HTTP methods
- **API versioning**: `/api/v1/` prefix for future compatibility
- **Route grouping**: Logical organization of related endpoints
- **Method-based routing**: Handle different HTTP methods in single handler

### Configuration Management
- **Environment-based config**: Support for dev/staging/prod environments
- **Struct-based settings**: Centralized configuration with validation
- **Secret management**: Secure handling of API keys and credentials
- **Feature flags**: Toggle functionality without code changes

### Error Handling & Logging
- **Structured logging**: JSON-formatted logs with context
- **Error wrapping**: Maintain error context through call stack
- **HTTP error responses**: Consistent error format across all endpoints
- **Request tracing**: Track requests through the system

### Testing Strategy for Large APIs
- **Handler testing**: Test HTTP endpoints with httptest
- **Service layer testing**: Unit tests for business logic
- **Integration testing**: Test with real database connections
- **API contract testing**: Ensure API compatibility
- **Load testing**: Validate performance under expected load

### Database Integration Patterns
- **Repository pattern**: Abstract data access behind interfaces
- **Connection pooling**: Efficient database connection management
- **Migration strategy**: Version-controlled database schema changes
- **Transaction management**: Proper handling of database transactions

### Authentication & Authorization
- **JWT implementation**: Stateless authentication for scalability
- **Middleware-based auth**: Centralized authentication logic
- **Role-based access**: Fine-grained permission control
- **Security headers**: CORS, CSP, and other security measures

### Monitoring & Observability
- **Metrics collection**: Request rates, response times, error rates
- **Health monitoring**: Application and dependency health checks
- **Structured logs**: Searchable and analyzable log format
- **Performance profiling**: CPU and memory usage tracking