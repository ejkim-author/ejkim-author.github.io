
* SDK 4.7.0 미만 버전에서는 Helper를 지원하지 않습니다. 기존 로그인 적용 방법은 [로그인·로그아웃하기](../../../authv4-login/)를 참고하세요.
* AuthV4.Helper에 대한 설명은 [인증](../#v4-helper) 페이지를 참고하세요.

### Login
stable version as below.

인증에서 로그인은 다음의 순서로 구성합니다.
* 1. [자동 로그인 및 묵시적 로그인](#helper-signin)
	2. [명시적 로그인](#explicit-signin)
	3. [기기에 로그인된 IdP 계정 확인](#checkprovider)
	4. [게스트 로그인](#guest-signin)


**Authv4Helper**는 로그인과 관련된 일련의 과정을 수행하며, 응답 값에 따라 적절한 화면으로 이동하도록 구성하는 클래스입니다.
[![](https://developers.withhive.com/wp-content/uploads/2020/12/login_helper_kr.png)](https://developers.withhive.com/wp-content/uploads/2020/12/login_helper_kr.png)

로그인 구성 시 다음 사항을 참고하세요.


Apple은 iOS 엔터프라이즈 빌드에 Apple Game Center와 인앱을 지원하지 않습니다. 따라서 iOS 엔터프라이즈 빌드에서는 Apple Game Center 계정을 이용하는 묵시적 로그인을 사용할 수 없으며 명시적 로그인에서도 Apple Game Center를 이용할 수 없습니다.


* 게임이 주로 13 세 미만 어린이를 대상으로하는 경우 Google Play 게임 서비스를 적용할 수 없으므로 Google 빌드에서 묵시적 로그인을 사용할 수 없습니다. 자세한 내용은 [Quality Checklist for Google Play Games Services](https://developers.google.com/games/services/checklist)를 참조하세요.
* 최초 로그인 시에만 Google Play 게임 묵시적 로그인을 시도해야 합니다. 자세한 내용은 Google 개발 가이드 [1.5 Remember if players declined signing-in](https://developers.google.com/games/services/checklist)을 참조하세요.



* 중국에서는 Google Play 게임을 이용할 수 없기 때문에 Android에서 묵시적 로그인을 사용할 수 없습니다.
* 중국에서는 Facebook을 이용할 수 없기 때문에 IdP 목록에 Facebook이 포함되지 않습니다.
* 중국 IP에서는 실명 인증된 유저만 재화를 충전 혹은 소비하는 서비스가 가능(2017. 5. 1 시행)하므로 중국 IP에서는 로그인할 수 있는 IdP 목록에 게스트 로그인이 포함되지 않습니다.



iOS는 Apple Game Center 로그인이 취소되어도 로그인 화면을 띄우지 않습니다. 그렇기 때문에 안내 문구는 SDK가 **AuthV4Helper** 클래스의 `showGameCenterLoginCancelDialog()` 메서드를 호출해서 직접 표시하도록 하거나 게임에서 표시하도록 선택할 수 있습니다. 유저가 Game Center 계정을 다시 연동할 수 있도록 문구를 직접 제공하고 싶다면, `AuthV4.signIn(AuthV4.ProviderType.APPLE, ...)`과 `AuthV4.connect(AuthV4.ProviderType.APPLE, ...)`의 콜백 결과가 Cancel인 경우에 [Game Center 취소 안내 문구](#idpconnect-guide-text)를 사용하세요.


만약 유저 기기가 Apple ID로 로그인되지 않은 상태에서 Apple로 로그인을 시도하면 **AuthV4Helper** 클래스의 `connect()`, `signIn()` [메서드를 호출](http://developers.withhive.com/api/hive-api/resultapicode_authv4/)하는 과정에 **AuthV4SignInAppleUnknown** 에러가 발생합니다. Apple ID 로그인 안내 팝업은 자동 노출되므로 게임 스튜디오에서 안내 팝업을 별도로 노출하지 않아도 됩니다.


#### 자동 로그인 및 묵시적 로그인


##### 자동 로그인


유저가 로그인 수단을 선택하지 않고 iOS에서는 Apple Game Center 계정을, Android에서는 Google Play 게임 계정을 자동 연동하여 로그인하는 방식을 의미합니다. 자동 로그인을 구현하고, 자동 로그인에 실패했을 경우 묵시적 로그인을 수행합니다.

##### Windows 환경에서 자동 로그인


Windows 환경도 자동 로그인을 지원하며, [Hive 콘솔 앱센터](https://developers.withhive.com/operation/appcenter/gamemanagement/#list02-05)에서 활성화/비활성화할 수 있습니다. 단, Windows 자동 로그인은 모바일과 다르게 동작합니다. Windows에서 자동 로그인은 다음과 같은 차이가 있습니다.
* 모바일에서는 로그인 이후에 무조건 자동 로그인으로 로그인 상태를 유지하지만, Windows에서는 유저가 로그인 유지 체크박스(로그인 UI상에서 IdP 목록 하단에 표시)를 활성화한 경우에만 로그인을 유지합니다. 그 외 상황에서는 로그인을 유지하지 않습니다.
* [AuthV4Helper.Connect](../../../dev4/authv4/idp-connect-helper/#idp-connect) 실행 시 모바일에서는 새로운 계정으로 계정을 전환할 경우 새 계정도 자동 로그인 상태를 유지하지만, Windows에서는 새로운 계정으로 계정을 전환할 경우 새 계정은 자동 로그인 상태를 유지하지 않습니다.


##### 묵시적 로그인


* 묵시적 로그인 플로우
[![](https://developers.withhive.com/wp-content/uploads/2022/10/implicit_flow_kr_221007_2.png)](https://developers.withhive.com/wp-content/uploads/2022/10/implicit_flow_kr_221007_2.png)


`AuthV4.Helper.signIn`은 PlayerID의 인증 토큰 키를 이용해 자동 로그인을 시도합니다. 기존에 로그인 했던 인증 토큰 키가 없다면 iOS인 경우 Apple Game Center에, Android인 경우 Google Play 게임에 자동으로 로그인합니다. 로그인을 실패하면 응답 값에 따라 적절한 로그인 화면을 구성합니다.


**AuthV4Helper** 클래스를 사용할 때


* 게임을 실행한 유저가 PGS 묵시적 로그인 시도 중 로그인을 거절한 경우, 이를 기억하고 더이상 묵시적 로그인을 시도하지 않습니다. 플레이어 세션이 유지되는 상태에서 자동 로그인이 가능하더라도 묵시적 로그인이 거절된 상태를 계속 기억합니다.


이 내용은 Google Play Games Services 가이드를 기반으로 작성하였습니다.

다음은 자동 로그인을 수행하는 예제 코드입니다.
=== "Unity"

    ```cs
    // Hive SDK 로그인(signIn) 시도    
        AuthV4.Helper.signIn (delegate (ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
                
        if (result.isSuccess()) {    
            // 로그인 성공    
        } else if (result.needExit()) {    
            // TODO: 앱 종료 기능을 구현하세요    
            // 예) Application.Quit();    
        } else {    
            switch (result.code) {    
                case ResultAPI.Code.AuthV4ConflictPlayer:    
                    // 계정 충돌    
                    break;    
                case ResultAPI.Code.AuthV4HelperImplifiedLoginFail:    
                    // 묵시적 로그인에 실패                   
                    // ex) AuthV4.showSignIn(...);    
                    break;    
                default:    
                    // 기타 예외 상황    
                    break;    
            }    
        }    
    });
    ```

=== "C++"

    ```cpp
    // Hive SDK 로그인(signIn) 시도    
        AuthV4::Helper::signIn([=](ResultAPI const & result, std::shared_ptr playerInfo) {    
                
        if (result.isSuccess()) {    
            // 로그인 성공    
        } else if (result.needExit()) {    
            // TODO: 앱 종료 기능을 구현하세요              
            // Cocos2d-x 엔진 사용자    
            // 예) exit(0);    
            // Unreal 엔진 사용자    
            // 예) UKismetSystemLibrary::QuitGame(GetWorld(), nullptr, EQuitPreference::Quit, false);    
        } else {    
            switch (result.code) {    
                case ResultAPI::AuthV4ConflictPlayer:    
                    // 계정 충돌    
                    break;    
                case ResultAPI::AuthV4HelperImplifiedLoginFail:    
                    // 묵시적 로그인에 실패    
                    // ex) AuthV4.showSignIn(...);    
                    break;    
                default:    
                    break;    
            }    
        }    
    });
    ```

=== "Kotlin"

    ```kt
    // Hive SDK 로그인(signIn) 시도    
        AuthV4.Helper.signIn(object : AuthV4.Helper.AuthV4HelperListener {    
        override fun onAuthV4Helper(result: ResultAPI, playerInfo: AuthV4.PlayerInfo?) {    
            if (result.isSuccess) {    
                // 로그인 성공    
            } else if (result.needExit()) {    
                // TODO: 앱 종료 기능을 구현하세요    
                // 예) exitProcess(0)    
            } else {    
                when (result.code) {    
                    ResultAPI.Code.AuthV4ConflictPlayer -> {    
                        // 계정 충돌    
                    }    
                    ResultAPI.Code.AuthV4HelperImplifiedLoginFail -> {    
                        // 묵시적 로그인에 실패    
                        // ex) AuthV4.showSignIn(...);    
                    }    
                    else -> {    
                        // 기타 예외 상황    
                    }    
                }    
            }    
        }    
    })
    ```

=== "Java"

    ```java
    // Hive SDK 로그인(signIn) 시도    
        AuthV4.Helper.signIn(new AuthV4.Helper.AuthV4HelperListener() {    
        @Override    
        public void onAuthV4Helper(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
                    
            if (result.isSuccess()) {    
                // 로그인 성공    
            } else if (result.needExit()) {    
                // TODO: 앱 종료 기능을 구현하세요    
                // 예) System.exit(0);    
            } else {    
                    switch (result.code) {    
                    case AuthV4ConflictPlayer:    
                        // 계정 충돌    
                        break;    
                    case AuthV4HelperImplifiedLoginFail:    
                        // 묵시적 로그인에 실패                   
                        // ex) AuthV4.showSignIn(...);    
                        break;    
                    default:    
                        // 기타 예외 상황    
                        break;    
                }    
            }    
        }      
    });
    ```

=== "Swift"

    ```swift
    // Hive SDK 로그인(signIn) 시도    
        AuthV4Interface.helper().signIn() { (result, playerInfo) in    
        if result.isSuccess() {    
            // 로그인 성공     
        }    
        else if result.needExit() {    
            // TODO: 앱 종료 기능을 구현하세요    
            // 예) exit(0)    
        }    
        else {    
            switch result.getCode() {    
            case .authV4ConflictPlayer:    
                // 계정 충돌       
            case .authV4HelperImplifiedLoginFail:    
                // 묵시적 로그인에 실패    
                // ex) AuthV4Interface.showSignIn() { (result, playerInfo)    
                // // do something...    
                // }    
            default:    
                // 기타 예외 상황    
                break       
            }    
        }    
    }
    ```

=== "Objective-C"

    ```objc
    // Hive SDK 로그인(signIn) 시도    
        [[HIVEAuthV4 helper] signIn:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
        if (result.isSuccess) {    
            // 로그인 성공     
        }    
        else if (result.needExit) {    
            // TODO: 앱 종료 기능을 구현하세요    
            // 예) exit(0);    
        }    
        else {    
            switch (result.code) {    
                case kAuthV4ConflictPlayer:    
                    // 계정 충돌    
                    break;        
                case kAuthV4HelperImplifiedLoginFail:    
                    // 묵시적 로그인에 실패    
                    // ex) [HIVEAuthV4 showSignIn:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
                    // // do something...    
                    // }];    
                    break;    
                default:    
                    // 기타 예외 상황    
                    break;       
            }    
        }    
    }];
    ```
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
#### 명시적 로그인


명시적 로그인이란 유저가 인증을 진행할 IdP를 선택하여 진행하는 것을 의미합니다. 자동 로그인과 묵시적 로그인 모두 실패했다면, 게임 타이틀 화면으로 이동한 후 타이틀에서 클릭했을 때 명시적 로그인을 수행하도록 구현하세요.

명시적 로그인 UI는 Hive SDK에서 제공하는 UI를 사용할 수도 있고 Hive SDK 초기화가 완료 후 결과로 반환되는 인증에 사용할 IdP 리스트를 이용하여 게임 자체 구현으로 커스터마이징 할 수 있습니다. UI를 커스터마이징 하는 경우 [명시적 로그인 커스터마이징](../advanced/#explicit-signin-customizing) 항목을 참고하세요.

IdP 리스트는 각 국가의 정책에 따라 Hive 플랫폼에서 제어하여 제공됩니다. 예를 들어, 중국에서는 Google Play 게임 및 Facebook, 게스트가 제공되지 않습니다.
##### 명시적 로그인 스크린샷


[![](https://developers.withhive.com/wp-content/uploads/2022/10/explicit_flow_kr_221007.png)](https://developers.withhive.com/wp-content/uploads/2022/10/explicit_flow_kr_221007.png)
**SDK에서 제공하는 IdP 선택 UI**
[![](https://developers.withhive.com/wp-content/uploads/2022/10/idp_list_kr_221007.png)](https://developers.withhive.com/wp-content/uploads/2022/10/idp_list_kr_221007.png)
##### SDK에서 제공하는 UI를 사용하여 구현하는 경우


SDK에서 제공하는 UI를 사용하여 명시적 로그인을 구현하기 위해서는 `showSignIn()` 메서드를 호출하여 IdP 리스트 UI를 간단히 호출할 수 있습니다.


유저가 SDK에서 제공하는 IdP 선택 UI에서 'X'버튼을 눌러 닫은 경우, 다시 로그인 할 수 있는 수단을 제공해야 합니다. 아직 유저는 로그인 하지 않은 상태입니다.



명시적 로그인을 커스터마이징하려면 [부가 기능](../advanced)에서 자세히 알아보세요.
=== "Unity"

    ```cs
    // Hive SDK AuthV4 인증 UI 요청    
        AuthV4.showSignIn((ResultAPI result, AuthV4.PlayerInfo playerInfo)=>{    
        if (result.isSuccess()) {    
            // 인증 성공    
            // playerInfo : 인증된 사용자 정보    
            // 이메일 정보 조회 예시    
            foreach (KeyValuePair<AuthV4.ProviderType, AuthV4.ProviderInfo> entry in playerInfo.providerInfoData) {    
                
                AuthV4.ProviderInfo providerInfo = entry.Value;    
                if(providerInfo.providerEmail != null && providerInfo.providerEmail != "") {    
                    string email = providerInfo.providerEmail;    
                    break;    
                }    
            }    
        }    
        else if (result.needExit()) {    
            // TODO: 앱 종료 기능을 구현하세요    
            // 예) Application.Quit();    
        }    
    });
    ```

=== "C++"

    ```cpp
    // Hive SDK AuthV4 인증 UI 요청    
        AuthV4::showSignIn([=](ResultAPI const & result, PlayerInfo const & playerInfo) {    
        if (result.isSuccess()) {    
            // 인증 성공    
            // playerInfo: 인증된 사용자 정보    
                    
            // 이메일 정보 조회 예시    
            for(auto it = playerInfo.providerInfoData.begin(); it != playerInfo.providerInfoData.end(); ++it) {    
                hive::ProviderInfo providerInfo = it->second;    
                if(!providerInfo.providerEmail.empty()) {    
                    std::string email = providerInfo.providerEmail;    
                    break;    
                }    
            }    
        }    
        else if (result.needExit()) {    
            // TODO: 앱 종료 기능을 구현하세요    
            // Cocos2d-x 엔진 사용자    
            // 예) exit(0);    
            // Unreal 엔진 사용자    
            // 예) UKismetSystemLibrary::QuitGame(GetWorld(), nullptr, EQuitPreference::Quit, false);    
        }    
    });
    ```

=== "Kotlin"

    ```kt
    // Hive SDK AuthV4 인증 UI 요청    
        AuthV4.showSignIn(object : AuthV4.AuthV4SignInListener {    
        override fun onAuthV4SignIn(result: ResultAPI, playerInfo: AuthV4.PlayerInfo?) {    
            if (result.isSuccess) {    
                // 인증 성공    
                // playerInfo: 인증된 사용자 정보    
                // 이메일 정보 조회 예시    
                playerInfo?.let {    
                    for ((key, value) in it.providerInfoData) {    
                        var providerInfo: AuthV4.ProviderInfo = value    
                        if(providerInfo.providerEmail.isNotEmpty()) {    
                            val email = providerInfo.providerEmail    
                            break    
                        }    
                    }    
                }    
            } else if (result.needExit()) {    
                // TODO: 앱 종료 기능을 구현하세요    
                // 예) exitProcess(0)    
            }    
        }    
    })
    ```

=== "Java"

    ```java
    // Hive SDK AuthV4 인증 UI 요청    
        AuthV4.showSignIn(new AuthV4.AuthV4SignInListener() {    
        @Override    
        public void onAuthV4SignIn(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
                        
            if (result.isSuccess()) {    
                // 인증 성공    
                // playerInfo: 인증된 사용자 정보    
                // 이메일 정보 조회 예시    
                if(playerInfo != null) {    
                    for (Map.Entry<AuthV4.ProviderType, AuthV4.ProviderInfo> entry : playerInfo.getProviderInfoData().entrySet()) {    
                        AuthV4.ProviderInfo providerInfo = entry.getValue();    
                        if (providerInfo.getProviderEmail() != "") {    
                            String email = providerInfo.getProviderEmail();    
                            break;    
                        }    
                    }    
                }    
            }    
            else if (result.needExit()) {    
                // TODO: 앱 종료 기능을 구현하세요    
                // 예) System.exit(0);    
            }    
        }    
    });
    ```

=== "Swift"

    ```swift
    var email = String()    
        // Hive SDK AuthV4 인증 UI 요청    
        AuthV4Interface.showSignIn { (result, playerInfo) in    
                    
        if result.isSuccess() {    
            // 인증 성공    
            // playerInfo: 인증된 사용자 정보    
            // 이메일 정보 조회 예시    
            if let playerInfo = playerInfo {    
                // providerEmail이 존재하는 providerInfo 탐색 (현재 로그인 진행된 provider)    
                for key in playerInfo.providerInfoData.keys {    
                    if let providerInfo = playerInfo.providerInfoData[key],    
                        providerInfo.providerEmail.count > 0 {    
                        // providerEmail != ""    
                        email = providerInfo.providerEmail    
                        break    
                    }    
                }    
            }    
        } else if result.needExit() {    
            // TODO: 앱 종료 기능을 구현하세요    
            // 예) exit(0)    
        }    
    }
    ```

=== "Objective-C"

    ```objc
    __block NSString* email = @"";    
        // Hive SDK AuthV4 인증 UI 요청    
        [HIVEAuthV4 showSignIn:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
        if([result isSuccess]){    
            // 인증 성공    
            // playerInfo: 인증된 사용자 정보    
            // 이메일 정보 조회 예시    
            if(playerInfo != nil) {    
                // providerEmail이 존재하는 providerInfo 탐색 (현재 로그인 진행된 provider)    
                for (NSString* key in playerInfo.providerInfoData.allKeys) {    
                    HIVEProviderInfo* providerInfo = playerInfo.providerInfoData[key];    
                    if (providerInfo != nil && providerInfo.providerEmail.length > 0) {    
                        // providerEmail != ""    
                        email = providerInfo.providerEmail;    
                        break;    
                    }    
                }    
            }    
        } else if ([result needExit]) {    
            // TODO: 앱 종료 기능을 구현하세요    
            // 예) exit(0);    
        }    
    }];
    ```
#### 명시적 로그인 커스터마이징


명시적 로그인의 커스터마이징 UI는 `providerTypeList`를 이용해 구현할 수 있습니다. `providerTypeList`는 Hive SDK를 초기화할 목적으로 `AuthV4.setup()` 메서드를 호출하거나, 초기화 이후 `AuthV4.Helper.getIDPList()` 메서드를 호출했을 때 반환되는 응답 콜백 핸들러입니다. 게임 UI에 맞추어서 로그인 화면을 노출하거나 특정 IdP와의 연동만을 주로 노출하고 싶을 때 이 기능을 사용합니다. 커스터마이징 UI를 구현한 후에는 유저의 액션에 따라 원하는 ProviderType으로 `signIn()` 메서드를 호출해 로그인을 구현하세요.


* 로그인 버튼 제작 시에는 각 IdP에서 제공하는 디자인 가이드를 참고하여 로그인 버튼을 제작해야 합니다.
* Game Center: 별도 규정 없음
* Google Play Games: [Branding Guidelines](https://developers.google.com/games/services/branding-guidelines)
* Google: [Branding Guidelines](https://developers.google.com/identity/branding-guidelines)
* Hive 멤버십: [Hive BI Guidelines](https://developers.withhive.com/wp-content/uploads/2023/01/Hive_BI.zip)
* Facebook: [Brand Resource Center](https://en.facebookbrand.com/)
* QQ: [Policies and Regulations](http://wiki.connect.qq.com/网站前端页面规范)
* WeChat: [Primary brand &amp; Guidelines](https://wechat.design/resource)
* VK: [VK Brandbook](https://vk.com/brand)
* Apple: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview)
* LINE: [LINE Login Button Design Guidelines](https://developers.line.biz/en/docs/line-login/login-button)
* Huawei: [HUAWEI ID Icon Specifications](https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/account-specification)
* 구글 피쳐드에는 Google Sign-in 버튼 가이드를 준수하는 것이 중요합니다.
* Hive 인증에 적용된 다국어 로그인 버튼명은 [**여기**](https://jira.gamevilcom2us.com/jira/secure/attachment/223681/HiveAuthv4_LoginButtonName_20210205.pdf)를 참조해 주세요.

* **로그인 화면에 Facebook 연동 버튼만 노출하는 UI 예시 스크린샷**


[![](http://developers.withhive.com/wp-content/uploads/2018/04/24_dev4-authv4-advanced_1.png)](http://developers.withhive.com/wp-content/uploads/2018/04/24_dev4-authv4-advanced_1.png)

다음은 커스터마이징한 명시적 로그인 UI에서 유저가 Facebook 로그인을 선택한 상황을 가정한 예제 소스입니다.
=== "Unity"

    ```cs
    // Hive SDK AuthV4 인증 콜백 핸들러    
        public void onAuthV4SignIn(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
        if (reuslt.isSuccess() == true) {    
            // 인증 성공    
            // playerInfo : 인증된 사용자 정보.    
            // ProviderType.GOOGLE 의 이메일 정보 조회 예시    
            Dictionary<AuthV4.ProviderType, AuthV4.ProviderInfo> providerInfoData = playerInfo.providerInfoData;    
            AuthV4.ProviderInfo providerInfo = providerInfoData[AuthV4.ProviderType.GOOGLE];    
            string email = providerInfo.providerEmail;    
        }    
        }    
        // 선택된 ProviderType이 Google 인 경우    
    AuthV4.signIn(AuthV4.ProviderType.GOOGLE, onAuthV4SignIn);
    ```

=== "C++"

    ```cpp
    // 선택된 ProviderType이 GOOGLE인 경우    
        ProviderType providerType = ProviderType::GOOGLE;    
                
        // Hive SDK AuthV4 명시적 로그인 (signIn) 시도    
        AuthV4::signIn(providerType, [=](ResultAPI const & result, PlayerInfo const & playerInfo){    
        // 결과 콜백    
        if (result.isSuccess()) {    
            // 인증 성공    
            cout<<"PlayerName : " << playerInfo.playerName << endl;    
            cout<<"PlayerId : " << playerInfo.playerId << endl;    
            // ProviderType.GOOGLE 의 이메일 정보 조회 예시    
            map<ProviderType, ProviderInfo> providerInfoData = playerInfo.providerInfoData;    
            ProviderInfo providerInfo = providerInfoData[ProviderType::GOOGLE];    
            std::string email = providerInfo.providerEmail;    
        } else {    
            // TODO : ErrorHandling    
        }    
    });
    ```

=== "Java"

    ```java
    //선택된 ProviderType, ex) GOOGLE    
        AuthV4.ProviderType providerType = AuthV4.ProviderType.GOOGLE;       
                
        AuthV4.signIn(providerType, new AuthV4.AuthV4SignInListener() {    
        @Override    
        public void onAuthV4SignIn(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
            if (result.isSuccess()) {    
                // 인증 성공    
                // playerInfo: 인증된 사용자 정보    
                // ProviderType.GOOGLE 의 이메일 정보 조회 예시    
                if(playerInfo != null) {    
                    HashMap<ProviderType, ProviderInfo> providerInfoData = playerInfo.getProviderInfoData();    
                    ProviderInfo providerInfo = providerInfoData.get(ProviderType.GOOGLE);    
                    if(providerInfo != null) {    
                        String email = providerInfo.getProviderEmail();    
                    }    
                }    
            }    
        }    
    });
    ```

=== "Objective-C"

    ```objc
    // Hive SDK 로그인(signIn)    
        [HIVEAuthV4 signIn:kHIVEProviderTypeGOOGLE handler:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
        Loggerd(@"HIVEAuthV4.signIn:handler:\nresult = %@\nplayerInfo = %@", result, playerInfo);    
        if([result isSuccess]){    
            // 인증 성공    
            // playerInfo: 인증된 사용자 정보    
            // ProviderType.GOOGLE 의 이메일 정보 조회 예시    
            if(playerInfo != nil) {    
                HIVEProviderInfo* providerInfo = playerInfo.providerInfoData[@"GOOGLE"];    
                if(providerInfo != nil){    
                    NSString* email = providerInfo.providerEmail;    
                }    
            }    
        }    
    }];
    ```
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
#### 기기에 로그인한 IdP 계정 확인


자동 로그인은 저장된 PlayerID의 인증 토큰 키만으로 로그인하고, 명시적 로그인은 여러 IdP에 연동된 계정에 로그인합니다. 이 두 가지 경우 로그인 PlayerID의 IdP계정과 실제 단말에 로그인한 IdP 계정(DevicePlayer)이 다를 수 있습니다. 추후 업적이나 리더보드 사용에 대비해 두 계정을 통일할 수 있도록 안내 문구를 제공합니다.
* **SDK가 제공하는 DevicePlayer 사용 여부 확인 UI**
[![](https://developers.withhive.com/wp-content/uploads/2021/03/account_conflicts_kr.png)](https://developers.withhive.com/wp-content/uploads/2021/03/account_conflicts_kr.png)


다음은 IdP 정보를 확인하는 예제 코드입니다.
=== "Unity"

    ```cs
    AuthV4.ProviderType providerType; //example : "GUEST", "HIVE", "FACEBOOK", "GOOGLE", "QQ","WEIBO", "VK","WECHAT", "APPLE", "HUAWEI", "AUTO"    
        AuthV4.Helper.syncAccount (providerType, delegate (ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
            switch(result.code) {    
                case ResultAPI.Code.Success:    
                    // 정상    
                    break;    
                case ResultAPI.Code.AuthV4ConflictPlayer:    
                    // 계정 충돌    
                    // ex) Hive UI 사용시     
                    // AuthV4.Helper.showConflict(...);    
                    // or    
                    // ex) GameUI 구현시    
                    // AuthV4.Helper.resolverConflict(...);// 현재 사용자 선택시    
                    // AuthV4.Helper.switchAccount(...);// 사용자 전환 선택시    
                    break;    
                default:    
                    // 기타 예외 상황    
                    break;    
            }    
    });
    ```

=== "C++"

    ```cpp
    std::string providerType; //example : "GUEST", "HIVE", "FACEBOOK", "GOOGLE", "QQ","WEIBO", "VK","WECHAT", "APPLE", "HUAWEI", "AUTO"    
        AuthV4::Helper::syncAccount(ProviderInfo::providerTypeFromString(providerType), [=](ResultAPI const &amp; result, std::shared_ptr playerInfo) {    
                switch (result.code) {    
                    case ResultAPI::Success:    
                    // 정상    
                    break;    
                    case ResultAPI::AuthV4ConflictPlayer:    
                    // 계정 충돌    
                    // ex) Hive UI 사용시     
                    // AuthV4::Helper::showConflict(...);    
                    // or    
                    // ex) GameUI 구현시    
                    // AuthV4::Helper::resolverConflict(...);// 현재 사용자 선택시    
                    // AuthV4::Helper::switchAccount(...);// 사용자 전환 선택시    
                    break;    
                    default:    
                    break;    
                    }    
    });
    ```

=== "Java"

    ```java
    // 체크할 ProviderType    
        ProviderType providerType = AuthV4.ProviderType.GOOGLE;    
        AuthV4.Helper.syncAccount(ProviderType providerType,    
                                    AuthV4.Helper.AuthV4HelperListener listener) {    
            @Override    
            public void onAuthV4Helper(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
                switch(result.code) {    
                    case Success:    
                        // 정상    
                        break;    
                    case AuthV4ConflictPlayer:    
                        // 계정 충돌    
                        // ex) Hive UI 사용시     
                        // AuthV4.Helper.showConflict(...);    
                        // or    
                        // ex) GameUI 구현시    
                        // AuthV4.Helper.resolverConflict(...);// 현재 사용자 선택시    
                        // AuthV4.Helper.switchAccount(...);// 사용자 전환 선택시    
                        break;    
                    default:    
                        // 기타 예외 상황    
                        break;    
                }    
            }    
    });
    ```

=== "Objective-C"

    ```objc
    HIVEProviderType providerType = kHIVEProviderTypeAPPLE;    
        [[HIVEAuthV4 helper] syncAccount:kHIVEProviderTypeAPPLE handler:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
            switch(result.code) {    
                case kSuccess:    
                // 정상    
                break;    
                case kAuthV4ConflictPlayer:    
                // 계정 충돌    
                // ex) Hive UI 사용시     
                // [[HIVEAuthV4 helper] showConflict:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {;}];    
                // or    
                // ex) GameUI 구현시    
                // [[HIVEAuthV4 helper] resolveConflict:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {;}];// 현재 사용자 선택시    
                // [[HIVEAuthV4 helper] switchAccount:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {;}];// 사용자 전환 선택시    
                break;    
                default:    
                // 기타 예외 상황    
                break;    
            }    
        }];
    ```
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
#### 게스트 로그인


유저가 IdP를 선택하지 않고 게스트 상태로 게임을 이용할 수 있도록 게스트 로그인 기능을 지원합니다. Hive SDK가 제공하는 명시적 로그인 UI에서 게스트를 선택할 수도 있고, 게임에서 커스터마이징하여 직접 구현하는 경우에도 게스트 로그인을 구현할 수 있습니다. Windows 환경은 게스트 로그인을 지원하지 않습니다.

게스트 로그인 시에는 다음의 정책을 반드시 준수해야 합니다.
##### 게스트 로그인 정책


* + **IdP 인증 유저와 게스트 유저 모두 게임을 동일하게 이용할 수 있게 구현하세요.**
	게스트 로그인 시에도 Hive 플랫폼의 기능 대부분을 이용할 수 있습니다. 때문에 여러분의 게임에서도 게스트로 로그인한 유저가 IdP 연동 유저와 동일하게 게임을 이용할 수 있도록 구현해 주세요. 예를 들면 게스트 유저도 게임 내에서 아이템을 구매하고 결제할 수 있어야 합니다.
	+ **게스트 유저에게 로그아웃 기능을 제공하지 마세요.**
	유저가 게스트로 로그인 한 후 로그아웃하면 더 이상 동일한 PlayerID로 로그인이 불가합니다. 따라서 유저가 게스트로 로그인 했을 때는 로그아웃을 못하도록 로그아웃 버튼을 제공하지 마세요.
	+ **중국 게스트 로그인 금지 정책**
	중국 IP를 사용할 경우에는 실명 인증된 유저만 재화를 충전·소비하는 서비스가 가능(17. 5. 1시행)하므로 중국 IP로 로그인할 수 있는 IdP 목록에 게스트 로그인이 포함되지 않습니다.


게스트 로그인을 수행하기 위해서는 `ProviderType.GUEST`를 파라미터로 `signIn()` 메서드를 호출하세요.
다음은 게스트 로그인을 수행하는 예제 코드입니다.


아무 IdP인증이 없는 게스트 상태의 PlayerID는 playerInfo의 providerInfoData가 없습니다.
=== "Unity"

    ```cs
    // Hive SDK AuthV4 인증 콜백 핸들러    
        public void onAuthV4SignIn(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
            if (result.isSuccess() == true) {    
                // 인증 성공.    
                // playerInfo : 인증된 사용자 정보    
            }    
        }    
        // GUEST 로그인    
    AuthV4.signIn(AuthV4.ProviderType.GUEST, onAuthV4SignIn);
    ```

=== "C++"

    ```cpp
    AuthV4::signIn(ProviderType::GUEST, [=](ResultAPI const &amp; result, PlayerInfo const &amp; playerInfo) {    
            // 결과 콜백    
            if (result.isSuccess()) {    
                // 인증 성공    
                cout&lt;&lt;"PlayerName : " &lt;&lt; playerInfo.playerName &lt;&lt; endl;    
                cout&lt;&lt;"PlayerId : " &lt;&lt; playerInfo.playerId &lt;&lt; endl;    
            } else {    
                // TODO : ErrorHandling    
            }    
    });
    ```

=== "Java"

    ```java
    AuthV4.ProviderType providerType = AuthV4.ProviderType.GUEST;    
        AuthV4.signIn(providerType, new AuthV4.AuthV4SignInListener() {    
            @Override    
            public void onAuthV4SignIn(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
                if (result.isSuccess()) {    
                    // 인증 성공    
                    // playerInfo: 인증된 사용자 정보    
                }    
            }    
    });
    ```

=== "Objective-C"

    ```objc
    // Hive SDK 로그인(signIn)    
        [HIVEAuthV4 signIn:kHIVEProviderTypeGUEST handler:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
            Loggerd(@"HIVEAuthV4.signIn:handler:nresult = %@nplayerInfo = %@", result, playerInfo);    
                
            if (!result.isSuccess) {    
                return;    
            }    
    }];
    ```
#### 커스텀 로그인


**커스텀 로그인**은 *맞춤형 로그인* 기능으로, Hive에서 제공하는 IdP 외에 게임 자체에서 연동하는 IdP로 로그인을 구현할 수 있습니다. [인증 v4 커스텀 인증하기](/?page_id=61971)에 따라 커스텀 로그인 API 호출 시 사용할 인증 키(authKey)를 생성해 보세요.
커스텀 로그인 API 호출 후 콜백으로 전달 받는 **PlayerInfo** 클래스 인스턴스로 `customProviderInfoData` 데이터에 접근하여 커스텀 로그인된 유저 정보를 확인할 수 있습니다. `customProviderInfoData`의 **ProviderType(enum)** 은 모두 `CUSTOM`으로 동일하게 설정되며, **ProviderName(String)**으로 상세히 구분할 수 있습니다.

> 
> * 게임에서 커스텀 로그인을 구현한 IdP의 정보는 **AuthV4** 클래스의 `setup()` 및 `showSignIn()` 메서드 호출 결과에 포함되지 않습니다.
> * 커스텀 로그인 최초 실행 후 **playerId**와 **playerToken**을 발급받았다면, 커스텀 로그인 API 재호출 시 `authV4SessionExist(code)`의 Result API가 콜백으로 전달됩니다. 이 경우에는 `ProviderType.Auto`를 파라미터로 `signIn()`를 호출하여 기존에 로그인된 계정으로 자동 로그인을 진행해야 합니다. 아래의 예제 코드를 참조하세요.
> * **AuthV4** 클래스의 `connect()`와 `disconnect()` 메서드는 커스텀 로그인 IdP의 추가 연동 및 해제를 지원하지 않습니다.
> * `connectWithAuthKey()`와 `disconnectWithName()` 메서드로 커스텀 로그인 IdP의 추가 연동 및 해제를 지원합니다.
> 
> 
> 


다음은 커스텀 로그인을 구현하는 예제코드입니다.
=== "Unity"

    ```cs
    // 게임에서 직접 구현한 트위터 로그인    
        Game.Login("CUSTOM_TWITTER", (string authKey) => {    
        AuthV4.signInWithAuthKey(authKey, (ResultAPI result, PlayerInfo playerInfo) => {    
            if (result.isSuccess()) {    
                Dictionary<string, ProviderInfo> customProviderInfoData = playerInfo.customProviderInfoData;    
                ProviderInfo providerInfo = customProviderInfoData["CUSTOM_TWITTER"];    
                // 다음의 유저 연동 정보 확인    
                providerInfo.providerType;     // ProviderType.CUSTOM, 커스텀들은 Type 이 고정이니 providerName 으로 구분 필요    
                providerInfo.providerName;   // "CUSTOM_TWITTER"    
                providerInfo.providerUserId;  // 직접 구현한 트위터 로그인에 사용된 사용자 id    
                return;    
            }    
            else if (result.code == ResultAPI.Code.AuthV4SessionExist) {    
                // 이미 playerId 및 playerToken을 발급 받아 자동로그인이 필요한 경우    
                // TODO: AuthV4.signIn(ProviderType.AUTO, (ResultAPI _result, PlayerInfo playerInfo) => {});    
            }    
            else if (result.code == ResultAPI.Code.AuthV4NotInitialized) {    
                // TODO: SDK 초기화 필요    
            }    
            else if (result.code == ResultAPI.Code.AuthV4InvalidParam) {    
                // TODO: 전달한 authKey의 값이 NULL 이거나 비어있는 값인지 확인 필요    
            }    
            else if (result.needExit()) {    
                // TODO: 앱 종료 기능을 구현하세요     
                // 예) Application.Quit();    
            }    
        });    
    });
    ```

=== "C++"

    ```cpp
    using namespace std;    
        using namespace hive;    
        // 게임에서 직접 구현한 트위터 로그인    
        Game::Login("CUSTOM_TWITTER", [=](string authKey) {    
        AuthV4::signInWithAuthKey(authKey, [=](ResultAPI const & result, PlayerInfo const & playerInfo) {    
            if (result.isSuccess()) {    
                map<string, ProviderInfo> customProviderInfoData = playerInfo.customProviderInfoData;    
                ProviderInfo providerInfo = customProviderInfoData["CUSTOM_TWITTER"];    
                // 다음의 유저 연동 정보 확인    
                providerInfo.providerType; // ProviderType::CUSTOM, 커스텀들은 Type 이 고정이니 providerName 으로 구분 필요    
                providerInfo.providerName; // "CUSTOM_TWITTER"    
                providerInfo.providerUserId; // 직접 구현한 트위터 로그인에 사용된 사용자 id    
                return;    
            }    
            else if (result.code == ResultAPI::Code::AuthV4SessionExist) {    
                // 이미 playerId 및 playerToken을 발급 받아 자동로그인이 필요한 경우    
                // TODO: AuthV4.signIn(ProviderType::AUTO, [=](ResultAPI const & _result, PlayerInfo const & playerInfo) {});    
            }    
            else if (result.code == ResultAPI::Code::AuthV4NotInitialized) {    
                // TODO: SDK 초기화 필요    
            }    
            else if (result.code == ResultAPI::Code::AuthV4InvalidParam) {    
                // TODO: 전달한 authKey의 값이 NULL 이거나 비어있는 값인지 확인 필요    
            }    
            else if (result.needExit()) {    
                // TODO: 앱 종료 기능을 구현하세요    
                // Cocos2d-x 엔진 사용자    
                // 예) exit(0);    
                // Unreal 엔진 사용자    
                // 예) UKismetSystemLibrary::QuitGame(GetWorld(), nullptr, EQuitPreference::Quit, false);      
            }    
        });    
    });
    ```

=== "Kotlin"

    ```kt
    // 게임에서 직접 구현한 트위터 로그인    
        Game.Login("CUSTOM_TWITTER") { authKey: String ->    
        AuthV4.signInWithAuthKey(authKey, object : AuthV4.AuthV4SignInListener {    
            override fun onAuthV4SignIn(result: ResultAPI, playerInfo: AuthV4.PlayerInfo?) {    
                
                if (result.isSuccess && playerInfo != null) {    
                    playerInfo.customProviderInfoData["CUSTOM_TWITTER"]?.let { providerInfo ->    
                        providerInfo.providerType   // ProviderType.CUSTOM, 커스텀들은 Type 이 고정이니 providerName 으로 구분 필요    
                        providerInfo.providerName   // "CUSTOM_TWITTER"    
                        providerInfo.providerUserId // 직접 구현한 트위터 로그인에 사용된 사용자 id    
                    }    
                }    
                else if (result.needExit()) {    
                    // TODO: 앱 종료 기능을 구현하세요    
                    // 예) exitProcess(0)    
                }    
                else if (result.code == ResultAPI.Code.AuthV4SessionExist) {    
                    // 이미 playerId 및 playerToken을 발급 받아 자동로그인이 필요한 경우    
                    // TODO: AuthV4.signIn(AuthV4.ProviderType.AUTO, authV4SignInListener)    
                }    
                else if (result.code == ResultAPI.Code.AuthV4NotInitialized) {    
                    // TODO: SDK 초기화 필요    
                }    
                else if (result.code == ResultAPI.Code.AuthV4InvalidParam) {    
                    // TODO: 전달한 authKey의 값이 NULL 이거나 비어있는 값인지 확인 필요    
                }    
            }    
        })    
    }
    ```

=== "Java"

    ```java
    // 게임에서 직접 구현한 트위터 로그인    
        Game.Login("CUSTOM_TWITTER") { authKey: String ->    
            AuthV4.INSTANCE.signInWithAuthKey(authKey, new AuthV4.AuthV4SignInListener() {    
                @Override    
                public void onAuthV4SignIn(@NonNull ResultAPI result, @Nullable AuthV4.PlayerInfo playerInfo) {    
                    if(result.isSuccess() && playerInfo != null) {    
                        HashMap<String, AuthV4.ProviderInfo> customProviderInfoData = playerInfo.getCustomProviderInfoData();    
                        AuthV4.ProviderInfo providerInfo = customProviderInfoData.get("CUSTOM_TWITTER");    
                        // 다음의 유저 연동 정보 확인    
                        if (providerInfo != null){    
                            providerInfo.getProviderType(); // AuthV4.ProviderType.CUSTOM, 커스텀들은 Type 고정이니 providerName 으로 구분 필요    
                            providerInfo.getProviderName(); // "CUSTOM_TWITTER"    
                            providerInfo.getProviderUserId(); // 직접 구현한 트위터 로그인에 사용된 사용자 id    
                        }    
                    } else if (result.needExit()) {    
                        // TODO: 앱 종료 기능을 구현하세요    
                        // 예) System.exit(0);    
                    } else if (result.getCode() == ResultAPI.Code.AuthV4SessionExist) {    
                        // 이미 playerId 및 playerToken을 발급 받아 자동로그인이 필요한 경우    
                        // TODO: AuthV4.signIn(AuthV4.ProviderType.AUTO, authV4SignInListener)    
                    } else if (result.getCode() == ResultAPI.Code.AuthV4NotInitialized) {    
                        // TODO: SDK 초기화 필요    
                    } else if (result.getCode() == ResultAPI.Code.AuthV4InvalidParam) {    
                        // TODO: 전달한 authKey의 값이 NULL 이거나 비어있는 값인지 확인 필요    
                    }    
                }    
            });    
    }
    ```

=== "Swift"

    ```swift
    // 게임에서 직접 구현한 트위터 로그인    
        Game.login("CUSTOM_TWITTER") { (authKey) in    
        AuthV4Interface.signInWithAuthKey(authKey) { (result, playerInfo) in    
            if result.isSuccess() {    
                let customProviderInfoData = playerInfo?.customProviderInfoData;    
                let providerInfo = customProviderInfoData?["CUSTOM_TWITTER"]    
                // 다음의 유저 연동 정보 확인    
                providerInfo?.providerType;     // AuthProviderType, 커스텀들은 Type 이 고정이니 providerName 으로 구분 필요    
                providerInfo?.providerName;     // "CUSTOM_TWITTER"    
                providerInfo?.providerUserId;   // 직접 구현한 트위터 로그인에 사용된 사용자 id    
                return    
            }    
            else if result.getCode() == .authV4SessionExist {    
                // 이미 playerId 및 playerToken을 발급 받아 자동로그인이 필요한 경우    
                // TODO: AuthV4Interface.signIn(.auto) { (result, playerInfo) in }    
            }    
            else if result.getCode() == .authV4NotInitialized {    
                // TODO: SDK 초기화 필요    
            }    
            else if result.getCode() == .authV4invalidParam {    
                // TODO: 전달한 authKey의 값이 nil 이거나 비어있는 값인지 확인 필요    
            }    
            else if result.needExit() {    
                    // TODO: 앱 종료 기능을 구현하세요.    
                // 예) exit(0)    
            }    
        }    
    }
    ```

=== "Objective-C"

    ```objc
    // 게임에서 직접 구현한 트위터 로그인    
        [Game login:@"CUSTOM_TWITTER" handler:^(NSString* authKey) {    
                
        [HIVEAuthV4 signInWithAuthKey:authKey handler:^(HIVEResultAPI* result, HIVEPlayerInfo* playerInfo) {    
                if (result.isSuccess) {    
                    NSDictionary<NSString*, HIVEProviderInfo*>* customProviderInfoData = playerInfo.customProviderInfoData;    
                    ProviderInfo* providerInfo = [customProviderInfoData objectForKey:@"CUSTOM_TWITTER"];    
                    // 다음의 유저 연동 정보 확인    
                    providerInfo.providerType;     // HIVEProviderTypeCustom, 커스텀들은 Type 이 고정이니 providerName 으로 구분 필요    
                    providerInfo.providerName;   // "CUSTOM_TWITTER"    
                    providerInfo.providerUserId;  // 직접 구현한 트위터 로그인에 사용된 사용자 id    
                    return;    
                }    
                else if (result.getCode == HIVEResultAPICodeAuthV4SessionExist) {    
                    // 이미 playerId 및 playerToken을 발급 받아 자동로그인이 필요한 경우    
                    // TODO: [HIVEAuthV4 signIn:HIVEProviderTypeAuto, handler:^(HIVEResultAPI* _result, HIVEPlayerInfo* playerInfo) {}];    
                }    
                else if (result.getCode == HIVEResultAPICodeAuthV4NotInitialized) {    
                    // TODO: SDK 초기화 필요    
                }    
                else if (result.getCode == HIVEResultAPICodeAuthV4InvalidParam) {    
                    // TODO: 전달한 authKey의 값이 NULL 이거나 비어있는 값인지 확인 필요    
                }    
                else if (result.needExit) {    
                    // TODO: 앱 종료 기능을 구현하세요.    
                    // 예) exit(0);    
                }    
        }];       
    }];
    ```
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
### 인증 토큰 키 유효성 검증


게임 서버에서는 로그인 성공 후 반환 된 Token, playerId, DID 정보를 이용하여 인증 토큰키의 유효성을 검증할 수 있습니다. Hive 인증에서는 멀티 디바이스 로그인과 중복 접속을 허용합니다.

동일한 계정으로 중복 접속을 허용하지 않을 경우, 게임 서버는 먼저 접속한 기기에 안내 메시지를 노출시킨 후 게임을 종료하고 나중에 접속한 기기에서 게임이 유지되도록 처리합니다. 이때 게임을 종료하지 않은 채 중복 접속할 경우 게임 플레이 기록이 정상적으로 반영되지 않을 수 있습니다. 해당 기능을 구현하려면 검증을 완료한 토큰 키를 관리하거나 이를 이용한 게임 자체의 세션 키를 관리하여 처리해야 합니다.

해당 기능은 [인증 토큰키 유효성 검증 Server API](../../../api/hive-server-api/auth/authv4-verifytoken/)를 참고하여 구현하세요.

[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
### Hive 톡플러스 로그인 토큰 획득


인증 v4 인터페이스를 통해 `signIn()` 완료 후 **AuthV4.getHiveTalkPlusLoginToken** API를 호출하여 획득한 로그인 토큰을 Hive 톡플러스 로그인 시 사용합니다. (관련 가이드: [Hive 톡플러스 로그인 가이드](/?page_id=72454))
=== "Unity"

    ```cs
    AuthV4.getHiveTalkPlusLoginToken((ResultAPI result, String loginToken) =&gt; {    
            if (result.isSuccess()) {    
                // SUCCESS    
                // TODO: 전달받은 loginToken 값 확인 후 HiveTalkPlus 로그인 진행    
            }    
    });
    ```

=== "Kotlin"

    ```kt
    // Kotlin    
        AuthV4.getHiveTalkPlusLoginToken(object : AuthV4.AuthV4GetHiveTalkPlusLoginTokenListener {    
            override fun onAuthV4GetHiveTalkPlusLoginToken(resultApi: ResultAPI, loginToken: String?) {    
                if (resultApi.isSuccess) {    
                    // SUCCESS    
                }    
            }    
    }
    ```

=== "Java"

    ```java
    // Java    
        com.hive.AuthV4.INSTANCE.getHiveTalkPlusLoginToken(new com.hive.AuthV4.AuthV4GetHiveTalkPlusLoginTokenListener() {    
            @Override    
            public void onAuthV4GetHiveTalkPlusLoginToken(@NotNull ResultAPI result, @Nullable String loginToken) {    
        if (result.isSuccess()) {    
        // SUCCESS    
        }    
            }    
    });
    ```

=== "Swift"

    ```swift
    // Swift    
        AuthV4Interface.getHiveTalkPlusLoginToken { result, loginToken in    
            if (result.isSuccess()) {    
                // SUCCESS    
            }    
    }
    ```

=== "Objective-C"

    ```objc
    // Objective-c    
        [HIVEAuthV4 getHiveTalkplusLoginToken:^(HIVEResultAPI* result, NSString* loginToken) {    
            if ([result isSuccess]) {    
                // SUCCESS    
            }    
    }];
    ```
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
### 백그라운드에서 IdP 계정 변경 감지


유저가 게임 실행 중에 기기 설정으로 이동하여 Apple Game Center 또는 Google Play 게임 계정을 변경할 수 있습니다. 게임 실행 중에 IdP 계정이 현재 PlayerID에 IdP 계정과 다른지 여부를 확인해야 하는 경우 `setProviderChangedListener()`를 SDK 초기화 이후 호출하세요. 해당 API를 호출하면 게임 Resume시 기기에 설정된 IdP계정이 변경되었다는 이벤트를 받을 수 있습니다.

iOS는 Apple Game Center, Android는 Google Play 게임의 계정이 변경 시에 동작하며 현재 로그인 된 PlayerID가 해당 IdP에 연동되어 있을 경우에만 응답이 전달됩니다. IdP 계정 변경 이벤트를 받을 경우, 유저에게 기기에 로그인된 IdP 계정을 사용할지 여부를 유저에게 선택할 수 있도록 UI를 구성합니다. 유저가 기기에 로그인된 IdP 계정을 선택하면, `signOut`을 호출하여 로그아웃 시킨 후, 묵시적 로그인을 진행합니다.


2021년 7월 이후 출시된 Google Play 게임을 설치한 단말은 Google Play 게임의 동작상 이슈로 인해 백그라운드에서 IdP 계정을 변경할 수 없습니다.



이 기능으로 게임 플레이가 중단되고 계정을 변경하라는 요청이 발생할 수 있으며, 로비 진입이나 상점 진입 같이 계정 동기화가 필요한 시점에만 제한적으로 사용할 수 있습니다.


다음은 유저가 게임을 다시 시작했을 때, 기기에 설정된 IdP 계정이 변경되었다는 이벤트를 받도록 설정하는 예제 코드입니다.
=== "Unity"

    ```cs
    // 기기에 인증되어 있는 Provider 사용자 정보 변경 확인 콜백 핸들러    
        public void onAuthV4SetProviderChangedListener(ResultAPI result, AuthV4.ProviderInfo providerInfo) {    
            if (providerInfo != null &amp;&amp; providerInfo.providerType == AuthV4.ProviderType.APPLE) {    
                // GameCenter 사용자 정보 변경.    
            }    
        }    
        // 기기에 인증되어 있는 Provider 사용자 정보 변경 확인 요청    
    AuthV4.setProviderChangedListener(onAuthV4SetProviderChangedListener);
    ```

=== "C++"

    ```cpp
    // Hive SDK AuthV4 기기에 인증되어 있는 Provider 사용자 정보 변경 확인 요청    
        AuthV4::setProviderChangedListener([=](ResultAPI const &amp; result, ProviderInfo const &amp; providerInfo) {    
            // 결과 콜백    
            if (result.isSuccess()) {    
                if (providerInfo.providerType == ProviderType::GOOGLE) {    
                    // Google Play Game Service 계정 변경    
                }    
            } else {    
                // TODO : Error Handling    
            }    
    });
    ```

=== "Java"

    ```java
    AuthV4.setProviderChangedListener(new AuthV4.AuthV4CheckProviderListener() {    
            @Override    
            public void onDeviceProviderInfo(ResultAPI result, ProviderInfo providerInfo) {    
                if (result.isSuccess()) {    
                    if (providerInfo != null &amp;&amp; providerInfo.providerType == AuthV4.ProviderType.GOOGLE) {    
                        //Google Play Game Service 계정 변경    
                    }    
                }    
            }    
    });
    ```

=== "Objective-C"

    ```objc
    // 기기에 인증되어 있는 Provider 사용자 정보 확인 요청    
        [HIVEAuthV4 setProviderChangedListener:^(HIVEResultAPI *result, HIVEProviderInfo *providerInfo) {    
            Loggerd(@"HIVEAuthV4.setProviderChangedListener:nresult = %@nproviderInfo = %@", result, providerInfo);    
            if (providerInfo &amp;&amp; providerInfo.providerType == kHIVEProviderTypeAPPLE) {    
                // GameCenter 사용자 정보 변경.    
            }    
    }];
    ```
[av\_textblock size='' font\_color='' color='']
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
### 게임 데이터 초기화


게임 데이터를 초기화할 때 로그아웃을 호출하지 마세요. PlayerID가 삭제되지 않기 때문에 계정간 충돌이 발생할 수 있습니다. 현재 로그인한 계정으로 계속 플레이할 수 있어야 하므로 유저가 명시적으로 요청하기 전에는 로그아웃을 호출하지 않도록 구현하세요.

[![](http://developers.withhive.com/wp-content/uploads/2019/07/190723_dev4_initialize-game-data_kr.png)](http://developers.withhive.com/wp-content/uploads/2019/07/190723_dev4_initialize-game-data_kr.png)

[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]
### 로그아웃



* Logout 동작시 인증 정보인 PlayerId 와 세션정보인 PlayerToken 그리고 모든 IDP의 세션정보들이 삭제됩니다.
* 모든 set으로 시작하는 API로 설정되는 값들은 초기화 되거나 삭제되지 않습니다.
	+ Configuration, Auth, Auth v4, Promotion, Push 클래스의 모든 set으로 시작하는 메소드
	+ 다음은 대표적인 예시입니다. ex> Configuration.setServer, Configuration.setUseLog, Configuration.setGameLanguage, Configuration.setHiveCertificationKey, Auth.setEmergencyMode, AuthV4.setProviderChangedListener, Promotion.setUserEngagementReady, Promotion.setAddtionalInfo, Push.setRemotePush, Push.setForegroundPush 등 set으로 시작하는 모든 메소드에 해당됩니다.
* SDK는 set으로 시작하는 메소드를 통해 설정된 값의 유효범위는 로그인, 로그아웃 상태가 아니라 앱의 라이프사이클내로 유지됩니다.


Hive 로그인을 수행하였다면 PlayerID 와 인증 토큰 키가 발급된 상태입니다. 로그아웃이란 PlayerID와 인증 토큰 키를 초기화 하는 기능을 수행합니다. `signOut()` 메서드를 호출해 로그아웃을 완료하면 게임 타이틀로 이동하고 타이틀 클릭 시 명시적 로그인을 수행합니다.


* 게스트 로그인 상태에서 로그아웃 시 동일한 PlayerID를 더 이상 찾을 수 없으므로 게스트 상태에서는 로그아웃을 제공하지 않도록 구현해주세요.
* 로그아웃해도 PlayerID의 IdP 연동 상태는 변경되지 않습니다.
* 로그아웃이 완료되면 게임 타이틀로 이동하고 타이틀 클릭 시에는 명시적 로그인을 수행합니다.
* 로그아웃 후 앱을 재 시작하면 묵시적 로그인부터 수행합니다.


다음은 로그아웃을 수행하는 예제 코드입니다.
=== "Unity"

    ```cs
    // Hive SDK 로그아웃 요청    
        AuthV4.Helper.signOut (delegate (ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
            switch(result.code) {    
                case ResultAPI.Code.Success:    
                    // 로그인 성공    
                    break;    
                default:    
                    // 기타 예외 상황    
                    break;    
            }    
    });
    ```

=== "C++"

    ```cpp
    //Hive SDK 로그아웃 요청    
        AuthV4::Helper::signOut([=](ResultAPI const &amp; result, std::shared_ptr playerInfo) {    
                switch (result.code) {    
                    case ResultAPI::Success:    
                        // 로그아웃 성공    
                        break;    
                    default:    
                        // 기타 예외 상황    
                        break;    
                }    
    });
    ```

=== "Java"

    ```java
    // Hive SDK 로그아웃 요청    
        AuthV4.Helper.signOut(new AuthV4.Helper.AuthV4HelperListener() {    
            @Override    
            public void onAuthV4Helper(ResultAPI result, AuthV4.PlayerInfo playerInfo) {    
                switch(result.code) {    
                    case Success:    
                        // 로그인 성공    
                        break;    
                    default:    
                        // 기타 예외 상황    
                        break;    
                }    
            }    
    });
    ```

=== "Objective-C"

    ```objc
    // Hive SDK 로그아웃 요청    
        [[HIVEAuthV4 helper] signOut:^(HIVEResultAPI *result, HIVEPlayerInfo *playerInfo) {    
            switch(result.code) {    
            case Success:    
                // 로그인 성공    
                break;    
            default:    
                // 기타 예외 상황    
                break;    
            }    
    }];
    ```
[su\_divider text="⇡ Go to top" divider\_color="#65737e" link\_color="#65737e" size="1"]

##### Game Center 취소 안내 문구




| 언어 | 문구 |
| --- | --- |
| 한국어 | **Apple Game Center 로그인이 취소되었습니다.**
Game Center 계정과 연동하려면 [설정 > Game Center]에서 로그인한 후 다시 시도해주세요. |
| 영어 | **Your login to the Game Center has been canceled.**
Log in at [Settings> Game Center] to sync to the Game Center Account and try again. |
| 일본어 | **Apple Game Center ログインがキャンセルされました。**
Game Center アカウントと連動するには [設定 > Game Center] にログインした後、再度お試しください。 |
| 중국어 간체 | **Apple Game Center已退出登录。**
若想与Game Center账号同步，请在设备[设置>Game Center]中重新登录后再试。 |
| 중국어 번체 | **登入Apple Game Center已取消。**
若想連動Game Center帳號，請至[設定 > Game Center]登入後，再試一次。 |
| 프랑스어 | **Ta connexion au Game Center a été annulée.**
Connecte-toi dans [Réglages > Game Center] pour synchroniser ton compte Game Center et essaie de nouveau. |
| 독일어 | **Das Einloggen ins Apple Game Center wurde abgebrochen.**
Die Synchronisation mit dem Game Center-Konto läuft über [Einstellungen > Game Center]. Logge dich ein und versuche es erneut. |
| 러시아어 | **Ваш авторизация в Game Center была отменена.**
Авторизуйтесь в Game Center через [Настройки > Game Center] и повторите попытку. |
| 스페인어 | **Tu Inicio de Sesión en Game Center ha sido cancelado.** 
Inicia Sesión en [Configuración>Game Center] para sincronizar a la Cuenta de Game Center, e inténtalo de nuevo. |
| 포르투갈어 | **O seu login no Game Center foi cancelado.**
Faça o login em [Configurações>Game Center] para sincronizar com a Conta do Game Center e tente novamente. |
| 인도네시아어 | **Login ke Apple Game Center telah dibatalkan.**
Hubungkan akun Game Center dengan login di [Pengaturan > Game Center] dan coba lagi. |
| 말레이시아어 | **Log masuk ke Game Center anda telah dibatalkan.**
Log masuk di [Tetapan>Game Center] untuk disegerakkan ke Akaun Game Center dan cuba lagi. |
| 베트남어 | **Đã hủy bỏ đăng nhập vào Apple Game Center.**
Đăng nhập tại [Cài đặt > Game Center] để đồng bộ với tài khoản Game Center và thử lại. |
| 태국어 | **การล็อกอินเข้า Game Center ของคุณถูกยกเลิก**
ล็อกอินที่ [การตั้งค่า>Game Center] เพื่อเชื่อมต่อบัญชี Game Center และโปรดลองอีกครั้ง |
| 이탈리아어 | **L'accesso all'Apple Game Center è stato annullato.**
Fai log-in su [Impostazioni > Game Center] per sincronizzare il tuo account con il Game Center e riprova. |
| 터키어 | **Apple Oyun Merkezine girişiniz iptal edilmiştir.**
Oyun Merkezi Hesabına ulaşmak için [Ayarlar>Oyun Merkezi]'nden giriş yapın ve tekrar deneyin. |
| 아랍어 | **تم إلغاء تسجيل الدخول إلى مركز الألعاب.**
سجل الدخول إلى [الإعدادات> مركز الألعاب] للمزامنة مع حساب مركز الألعاب وحاول مرة أخرى. |

